#!/usr/bin/python
#coding:utf-8
import os,sys,time,json

#fepack 集成
with open('fepack.json') as f:
    fedogConfig = json.loads(f.read())

#前端项目名
project = fedogConfig['release']['project']

def exeCmd(cmd):
    print '------------------------------------------------------'
    print cmd
    os.system(cmd)

def releaseDist():
    currPath = os.getcwd()
    bakTmp = '../dist'

    #删除遗留的__dist
    exeCmd('rm -rf ' + bakTmp)

    #进行打包编译
    cmd = 'fepack release dist'
    exeCmd(cmd)

    #删除其他文件
    os.chdir(os.path.join(currPath, bakTmp, project))
    exeCmd('rm -rf src; rm -rf tests; rm -rf build.py; rm -rf README.html')

    #npm publish
    exeCmd('npm publish')

    #删除bakTmp
    os.chdir(currPath)
    cmd = 'rm -rf ' + bakTmp
    exeCmd(cmd)

def main():
    releaseDist()

if __name__ == "__main__":
    main()
