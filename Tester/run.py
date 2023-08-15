import sys
import os
import glob
import json
import shutil
import subprocess
import re

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

def run_cmd(command, args):
    full_command = [command] + args
    subprocess.run(full_command)


def get_tests_in_dir(directory):
    files = []
    for file in glob.glob(os.path.join(directory, "*.js")):
        if is_file(file):
            files.append(file)
        elif is_dir(file):
            files += get_tests_in_dir(file)
    return files

params = sys.argv[1:]
if len(params) == 0:
    print("use: run.py path_to_config [path_to_test]")
    exit(0)

config_path = params[0]
test_file = "./tests"

if len(params) > 1:
    test_file = params[1]

tests_array = [test_file]
if is_dir(test_file):
    tests_array = get_tests_in_dir(test_file)

with open(config_path, "r") as config_file:
    config_content = config_file.read()

config = json.loads(config_content)
if not is_dir("./work_directory"):
    create_dir("./work_directory")
    create_dir("./work_directory/cache")

for test in tests_array:
    print("run test: " + test)
    run_file = test + ".runned.js"
    copy_file("./Tester.js", run_file)
    test_content = read_file(test)
    test_content = test_content.replace("Tester.", "await Tester.")
    matches = re.findall(r'import\s+([\w.]+)', test_content)
    for match in matches:
        replacement_import = f"const {match} = require('../lib/{match}');"
        replacement_usage = f"await {match}."
    
        test_content = test_content.replace(f"import {match}", replacement_import)
        test_content = test_content.replace(f"{match}.", replacement_usage)

    replace_in_file(run_file, "%%CONFIG%%", str(config_path))
    replace_in_file(run_file, "\"%%CODE%%\"", test_content)
    #run_cmd("node", [run_file])
    #os.remove(run_file)
