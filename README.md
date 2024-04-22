<!--ToDo: Docs-->

![Preview](./docs/preview.png)

# Simple Translator App

This project is a simple translator web application developed as part of the Cloud Computing II course at DHBW Stuttgart. Written in JavaScript and utilizing Google Cloud Translation AI, the app enables users to translate text between languages. It's designed for cloud deployment and comes with Terraform and Ansible scripts for easy setup. Additionally, it leverages Redis to store previous translation requests, enhancing efficiency. The goal is to showcase practical implementation of cloud computing concepts in a real-world application.

# Preparation

1. Make sure [Git](https://git-scm.com/), [Terraform](https://www.terraform.io/) and [Ansible](https://www.ansible.com/) are installed on the host machine
2. On your Google account activate: 
   - [Cloud Resource Manager API](https://console.cloud.google.com/marketplace/product/google/cloudresourcemanager.googleapis.com)
   - [Translation API](https://console.cloud.google.com/marketplace/product/google/translate.googleapis.com) like described [here](https://cloud.google.com/translate/docs/setup)
3. Create a new Service Account Key in your Google Account at IAM & Admin -> Service Accounts -> Compute Engine default service account -> Manage Keys - Create New Key (JSON)

# Deployment (Local)

1. If not already done, install [Docker Compose](https://docs.docker.com/compose/install/) and [gcloud cli](https://cloud.google.com/sdk/docs/install)
2. Run `gcloud auth application-default login` and follow the instructions to setup up the application default credentials
3. Run `docker compose up` to start the project
4. Open http://localhost in your favorite web browser

# Deployment (Cloud)

Run `git clone https://github.com/J-C-V/dhbw-cc-translate.git` to get the current project.

## Terraform

1. Navigate to the Terraform directory `cd dhbw-cc-translate/deployment/terraform`
2. Edit `main.tf` and replace all instances of the placeholders `PROJECT-ID`, `SSH-KEY` and `EMAIL-OF-SERVICE-ACCOUNT` with their corresponding values
3. Run `terraform init`
4. Run `terraform apply -auto-approve`
5. Take note of the output parameters vm_ip and redis_ip - We'll need them later for Ansible
6. The VM instance should be running now!

## Ansible

1.  Make sure your Ansible host can reach the VM instance per ssh
2.  Navigate to the Ansible directory - If you come from the Terraform deployment run `cd ../ansible`
3.  Edit `playbook.yml` and replace the placholders `BACKEND-URL` (Actual url of the backend `http://<<<VM-IP>>>:8080`) and `REDIS-HOST` with their corresponding values
4. Edit `inventory.ini` and replace the placeholders `VM-IP` and `ANSIBLE-USER` with their corresponding values
5. Create the file `gcp_credentials.json` in the Ansible directory with the previously created Service Account Key
6. Run `ansible-playbook -i inventory.ini playbook.yml`
7. The application is now running on your VM instance!

## Firewall

If you can't access the application in your browser, you need to set up your firewall in your Google account:

1. Firewall -> VPC-Network -> Firewall -> CREATE FIREWALL RULE -> ALL INSTANCES ON THE NETWORK -> Source: `0.0.0.0/0`, Ports: `tcp:80, 8080`
2. The web client should now be accessible under `http://VM-IP` and the service under `http://VM_IP:8080`!
