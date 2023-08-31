import sys
import os
import glob
import json
import shutil
import subprocess
import re
import platform
from concurrent.futures import ThreadPoolExecutor
import argparse

system = platform.system()


def is_file(file_path):
    return os.path.isfile(file_path)


def is_dir(dir_path):
    return os.path.isdir(dir_path)


def create_dir(dir_path):
    os.makedirs(dir_path, exist_ok=True)


def copy_file(src, dst):
    shutil.copyfile(src, dst)


def read_file(file_path):
    with open(file_path, "r") as file:
        return file.read()


def replace_in_file(file_path, old_text, new_text):
    with open(file_path, "r") as file:
        content = file.read()
    content = content.replace(old_text, new_text)
    with open(file_path, "w") as file:
        file.write(content)


def open_new_terminal(test_file):
    if system == "Windows":
        command = f"start /wait cmd /c node {test_file}"
    elif system == "Linux":
        command = f"x-terminal-emulator -e 'node {test_file}' & wait"
    else:
        print(f"Unknown system: {system}")
        return
    try:
        subprocess.run(command, shell=True)
        os.remove(test_file)
    except Exception as e:
        print(f"Error opening a new terminal: {str(e)}")


def run_test(test):
    print("Run test in a new terminal: " + test)
    run_file = test + ".runned.js"
    copy_file("Tester.js", run_file)
    test_content = read_file(test)
    tester_launch = 'Tester.launch();\n'
    test_content = tester_launch + test_content
    test_content = test_content.replace("Tester.", "await Tester.")

    matches = re.findall(r'const\s+(.*?)\s+=\s+require', test_content)
    for match in matches:
        replacement_usage = f"await {match}."
        test_content = test_content.replace(f"{match}.", replacement_usage)
    replace_in_file(run_file, "%%CONFIG%%", str(config_path))
    replace_in_file(run_file, "\"%%CODE%%\"", test_content)
    open_new_terminal(run_file)


def run_test_with_retries(test_path, num_retries):
    for _ in range(num_retries):
        run_test(test_path)


def get_tests_in_dir(directory):
    files = []
    for file in glob.glob(os.path.join(directory, "*.js")):
        if is_file(file):
            files.append(file)
        elif is_dir(file):
            files += get_tests_in_dir(file)
    return files


if __name__ == "__main__":
    script_directory = os.path.dirname(os.path.realpath(__file__))
    test_directory = os.path.join(script_directory, "tests")

    parser = argparse.ArgumentParser(description="Run tests with options")
    parser.add_argument("config_path", help="Path to the config file")
    parser.add_argument("test_path", nargs="?", default=test_directory,
                        help="Path to the test or directory")
    parser.add_argument("--retries", type=int, default=1,
                        help="Number of test execution retries")
    args = parser.parse_args()

    config_path = args.config_path
    test_dir = args.test_path 
    num_retries = args.retries
    with open(config_path, "r") as config_file:
        config_content = config_file.read()

    config = json.loads(config_content)
    os.environ["PUPPETEER_SKIP_CHROMIUM_DOWNLOAD"] = "true"
    if "browser" in config:
        print("Browser: " + config["browser"])
        os.environ["PUPPETEER_PRODUCT"] = config["browser"]

    if "executablePath" in config["config"]:
        print("Executable Path: " + config["config"]["executablePath"])
        os.environ["PUPPETEER_EXECUTABLE_PATH"] = config["config"]["executablePath"]

    if not is_dir("./work_directory"):
        create_dir("./work_directory")
        create_dir("./work_directory/cache")

    if not is_dir("./user_data"):
        create_dir("./user_data")
    
    if not os.path.exists(test_dir):
        print(f"Error: Test path '{test_dir}' does not exist.")
        sys.exit(1)

    if os.path.isfile(test_dir):
        run_test_with_retries(test_dir, num_retries)
        print(test_dir)
    elif os.path.isdir(test_dir):
        tests_array = get_tests_in_dir(test_dir)
        for test_path in tests_array:
            test_file_name = os.path.splitext(os.path.basename(test_path))[0]
            user_data_path = os.path.join("./user_data", test_file_name)
            user_profile_path = os.path.abspath(user_data_path)
            if not is_dir(user_data_path):
                create_dir(user_data_path)
            if system == "Linux":
                create_profile = f'firefox --CreateProfile "{test_file_name} {user_profile_path}"'
                subprocess.run(create_profile, shell=True)
        with ThreadPoolExecutor() as executor:
            for test_path in tests_array:
                executor.submit(run_test_with_retries, test_path, num_retries)
