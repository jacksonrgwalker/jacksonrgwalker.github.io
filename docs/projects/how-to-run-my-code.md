---
tags: ["how-to", "package-management", "python"]
description: "How to run code from my python projects"
layout: project
order_index: 9
pinned: true
# status: under construction
---
# How to run my python code 🐍

It recently ocurred to me that it's not obvious how to run code for the projects I post here on your own computer. If you don't already know, **all of the associated code for projects I post to this website are completely open to the public- in fact, the source code for this website is, too**. This website was built with [GitHub Pages](https://pages.github.com/), so the all of the assets and code are in this [GitHub repo](https://github.com/jacksonrgwalker/jacksonrgwalker.github.io/tree/gh-pages) (I had originally built the site with Python/[Flask](https://flask.palletsprojects.com/) but I was tired of paying for AWS hosting fees). 

Running python code starting from zero can be daunting. This guide is to help you through the process.

## Outline
There are six main steps to running code from a python project:
  1. Install Python
  2. Install a Package Manager
  3. Install Git
  4. Clone the Project Repository
  5. Install the Project Dependencies Using the Package Manager
  6. Run the Project Code

Now, if you have used python before, you probably have already done steps one and two. I am going to cover those anyway, so you can skip to step three.

## Step 1 - Install Python

Python is available through many different distributions, but the most common is [Anaconda](https://www.anaconda.com/). Anaconda is a free distribution of python that is available for Windows, Mac, and Linux. The Anaconda distribution is primarily geared for scientific computing, but it can be used for many other purposes. I highly recommend using Anaconda over other distributions.

Anaconda has Commercial, Team, and Enterprise versions, but all you need is the *free* individual edition which you can get [**here**](https://www.anaconda.com/products/individual). Just download the installer and run it. Chances are you can use all of the default install options.

Installing Anaconda will actually install a few more things than just python, but we will get to that later.  

## Step 2 - Install a Package Manager

Before we install a package manager, let me explain how to why we need one in the first place.

One of the most frustrating parts about getting started with coding (especially with python) is dealing with package management. I don't think there is nearly enough easily digestable documentation on how to install packages and maintain usuable virtual environments, which makes it even more difficult to get started.  

### What is package management?
 - When programming, we try to not “reinvent the wheel”
   - If someone has already coded a tried-and-true function, you might as well use that existing code instead of writing it yourself
   - In python, we can import code from existing packages that have been developed, debugged (hopefully), and tested
     - E.g. `import pandas`, `import matplotlib.pylot as plt`
 - Over time, packages are improved by adding features and removing bugs
   - When improvements are made, there are new versions of packages/libraries released
   - Often times, some versions are not compatible with older versions
   - Some packages rely on other specific versions of other packages, called requirements or dependencies
 - If we want to use multiple packages, then we use a package manager to insure their dependencies do not conflict 

### What is a virtual environment?
  - Sometimes we don’t get all packages to coexist with each other because they have conflicting dependencies 
  - Generally, we only work with the packages that we need for a task
    - Avoid unnecessary dependencies, potential conflicts, and “bloat”
  - Virtual Environments are isolated collections of packages that are usually specific to a particular project

### In Practice
For each of my projects, I will set up a seperate virtual environment to avoid package conflicts and insure that the packages and versions used for that project are saved at that snapshot in time. 

Python is known to have a dedicated and active developer community, which can be a double edged sword sometimes. Constant new releases of packages can be a headache if you are not careful about maintaining seperate virtual environments.

Technically, a package manager/installer and virtual environment manager are two different things. The package manager is used to install and manage packages, while the virtual environment manager is used to manage the virtual environments. For example, [pip](https://pip.pypa.io/en/stable/) is a package manager, while [virtualenv](https://virtualenv.pypa.io/en/stable/) is a virtual environment manager. However, we are not going to use those tools here. 

My preferred package manager is [conda](https://docs.conda.io/en/latest/), which is a also environment manager (Two for one!). Even better, installing **Anaconda** will install **conda** as well, automaticaly. So, if you did step 1, then you can skip to step 3. 

Just to reiterate: *Anaconda* is a *distribution* of python, while *conda* is the *package & virtual environment manager* that comes with *Anaconda*.

## Step 3 - Install Git

### What is Git? Github?

Luckily there already exists [great documentation about Git, how it works, and how to use it](https://docs.github.com/en/get-started/using-git/about-git)- so I won't explain too much here.  

The key takeaways are:
  - *Git* is a *version control system (VCS)* that allows you to track changes to your code on your own computer
    - Code projects are tracked inside of *repositories* (or "*repo*" for short)
    - When you make changes to your code, you can commit them to the repository
  - *Github* hosts Git repositories and provides developers with tools to ship better code
    - After we track local changes to code with Git, we can push those changes to the *remote* repo on Github, so that other people can see those changes
    - Git and Github are two similar but different things
    - Other services like [GitLab](https://about.gitlab.com/) and [Bitbucket](https://bitbucket.org/) also host Git repositories  

### Installation

If you have not installed nor used Git before, I recommend that you simply install [Github Desktop](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/overview/getting-started-with-github-desktop) which will also install Git for you. Github Desktop has a nice interface that makes it easy start using, as opposed to using Git in the command line interface which can be daunting. I also recomend that you take the time to read the [Github documentation](https://docs.github.com/en/get-started) to learn more about Git and hosting services like Github.

## 4. Clone the Project Repository

First, you are going to want to navigate to the projects repository. This is where you will be cloning the code from. 
For any python projects on my website, you can navigate to it's main repo with the github link at the top of the project page. 

<img src="{{ BASE_PATH }}/assets/img/how_to_run_my_code/github_link_example.png" alt="github_link_example" class="centered-image"> 

If you are using Github Desktop, then follow the [instructions to clone a repo here](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

This will copy the code from the repository to your computer. You get to choose where you want to save the code. By default, Github Desktop will save the code in `Users/<username>/Documents/GitHub/<repo_name>`. Changing the code in this directory will not affect the code in the remote repository, unless you commit the changes and push them to the repository from my side. So, feel free to play around with the code all you want. 

## 5. Install the Project Dependencies Using the Package Manager

Okay, so now that you have the code, you need to install the dependencies before you can get it to run. This is where the package manager comes in. 

### Environment Specification

Each of my python projects comes with an *environment specification* (or "*env spec*" for short) file, which is instruction that conda uses to recreate the environment I used to develop the project. 
 
#### Environment Specification Example 

For example, here is the [env spec for the PySquiggleDraw project](https://github.com/jacksonrgwalker/PySquiggleDraw/blob/main/environment.yml):

<img src="{{ BASE_PATH }}/assets/img/how_to_run_my_code/example_env_spec.png" alt="example_env_spec" class="centered-image"> 


The env spec...
 - uses [YAML](https://yaml.org/) format 
 - is named "environment.yml" and is located in the root directory of the repository
 - lists the packages that are needed to run the project
 - Optionally lists the versions of those packages
 - list where to find the packages
 - provides a default name for the environment

### Creating the Environment

Now that we have the instructions, lets recreate the environment. 

First, open the application `Anaconda Prompt` which should have been installed with Anaconda. (If you are using macOS, you can just use `Terminal`)

Navigate to the directory where the repo was cloned. If you are using Github Desktop with the default location, this will look like: 

*Windows* (using `Anaconda Prompt`)
```
(base) C:\Users\jackson>cd C:\Users\jackson\Documents\GitHub\PySquiggleDraw
(base) C:\Users\jackson\Documents\GitHub\PySquiggleDraw>
```
*macOS* (using `Terminal`, zsh)
```
(base) Jackson@Jacksons-Computer ~ % cd /Users/jackson/Documents/GitHub/PySquiggleDraw
(base) Jackson@Jacksons-Computer PySquiggleDraw %
```
Obviously, you would need to replace the username with your own username. Here we are using the PySquiggleDraw as an example, but you can use any project.

Then, run `conda env create -f environment.yml`. This will create a new environment based on the instructions in the env spec, which is located in the folder you just navigated too. The name of the environment will be the one specified in the env spec. If you want to name it something else, you can run `conda env create -f environment.yml --name <your-env-name-here>` instead.  

Before `conda` can create the environment, it first has to solve the environment (figure out non-conflicting dependancies) based on the instructions in the env spec. This can take a while, so be patient.

Once the environment is created, run `conda activate <env-name>`. This will activate the environment and allow you to run the project code.

## 6. Run the Project Code

Now that we have dependencies installed and the environment activated we can run the code. 

### Scripts and Jupyer Notebook
Depending on the project, this might mean running python scripts from the command line, but most of the time I like to use [Jupyter Notebooks](https://jupyter.org/). Jupyter Notebooks allow you to run code in an interactive cell-based interface. 

If Jupyter is part of the env spec, then you can launch jupyter lab by running `jupyter lab` (or `jupyter notebook`) in the command line once the environment is activated. 

### VS Code
If you have not used jupyter before, then I recomend you download and install [VS Code](https://code.visualstudio.com/). VS Code is an all around great IDE that has a lot of features and extensions, and it can also run Jupyter notebook files (.ipynb). VS Code will also help by installing jupyter dependencies for you if they are not there already, letting you choose which environment to use, and will take care of othe technical aspects that might not be clear as a beginner. 

Also, VS Code has fantastic resources to help you get started with Jupyter.
 - [Get started with Jupyter Notebooks in less than 4 minutes (video)](https://www.youtube.com/watch?v=h1sAzPojKMg&ab_channel=VisualStudioCode)
 - [Jupyter Notebooks in VS Code](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)

The basic steps to run the code from my project is:
 1. Look for the .ipynb files in the repo
 2. Open the .ipynb file with VS Code
 3. Choose the environment created in step 5
 4. Run the code cells 

That's it! Thanks for reading!

## Appendix

### Need help? Something not working? 
  - Feel free to shoot me an email at jacksonrgwalker@gmail.com if you have any issues or questions. 

### Keep in mind
 - Not all of my projects have dependancies. Some projects (e.g. [Blackjack Simulator]({{site.url}}/projects/blackjack-simulator)) just use pure python (i.e. uses only the [python standard library](https://docs.python.org/3/library/)) so there is no environment specificification provided. 
 - The environment specificification may not be comprehensive to run the project code, depending on the project and how I created the spec.
   - The environment specificification can be tricky to design as if it is too rigid, it might not work cross platform, but if it is too loose, it might install the incorrect dependancy versions. 
   - Generally, I will keep the env spec loose if I expect the package functionality used in the project will not change in newer versions.  
 
### Contributing
 - If you notice any bugs or have any suggestions with this guide, please feel free to open an issue on the [Github repository](https://github.com/jacksonrgwalker/jacksonrgwalker.github.io/issues) or simply commit a pull request with the fix.
 - If you are a developer and would like to contribute to any existing projects, please feel free to fork any repository and submit a pull request.
 
### More Resources
 - To learn more about using conda to manage environments see [Managing Environments](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html)
 - VS Code
   - [Get started with Visual Studio Code (video)](https://www.youtube.com/watch?v=S320N3sxinE&ab_channel=VisualStudioCode)
   - [Getting started with Visual Studio Code](https://code.visualstudio.com/docs/introvideos/basics)
   - [Getting started with Github](https://docs.github.com/en/get-started)