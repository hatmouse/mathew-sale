# -*- coding:utf-8 -*-
__author__ = 'Home'
import mysql.connector
from settings import MysqlConInfo
import json
import urllib.request
import contextlib

def CheckAuthority(username, password):
    if username is None or password is None:
        return False
    cnx,cursor=connectsql()
    x="select count(*) from users where username='%s'and password='%s'" %(username,password)
    cursor.execute(x)
    one=cursor.fetchall()
    one=one[0][0]
    if one!=0:
        return True
    else:
        return False

def addsale(username,sale_name,sale_desc,sale_contact,sale_price,sale_newold,img_name):
    cnx,cursor=connectsql()
    x="insert into seconds(username,sale_name,sale_desc,sale_contact,sale_price,sale_newold,sale_img) values ('%s','%s','%s','%s',%d,%d,'%s')" %(username,sale_name,sale_desc,sale_contact,sale_price,sale_newold,img_name)
    cursor.execute(x)
    cnx.commit()

def delsale(username,password,sale_id):
    if CheckAuthority(username,password):
        cnx,cursor=connectsql()
        x="select count(*) from seconds where username='%s' and id=%d" % (username,sale_id)
        cursor.execute(x)
        res=cursor.fetchall()
        if res[0][0]!=0:
            x="delete from seconds where username='%s' and id=%d" % (username,sale_id)
            cursor.execute(x)
            cnx.commit()
            return True
    return False

def salelist_json(page_number):
    cnx,cursor=connectsql()
    x="select id,users.nickname,users.sex,sale_name,sale_desc,sale_price,sale_newold,sale_contact,sale_img from seconds,users where users.username=seconds.username order by sale_time desc limit %d,%d" %((page_number-1)*20+10,10)
    cursor.execute(x)
    sales=cursor.fetchall()
    jsonstr=[]
    for x in sales:
        temp={}
        temp['sale_id']=x[0]
        temp['nickname']=x[1]
        temp['sex']=x[2]
        temp['sale_name']=x[3]
        temp['sale_desc']=x[4]
        temp['sale_price']=x[5]
        temp['sale_newold']=x[6]
        temp['sale_contact']=x[7]
        temp['sale_img']=x[8]
        jsonstr.append(temp)
    jsonstr=json.dumps(jsonstr,ensure_ascii=False)
    return jsonstr

def salelist(page_number):
    cnx,cursor=connectsql()
    x="select id,users.nickname,users.sex,sale_name,sale_desc,sale_price,sale_newold,sale_contact,sale_img from seconds,users where users.username=seconds.username order by sale_time desc limit %d,%d" %((page_number-1)*20,10)
    cursor.execute(x)
    sales=cursor.fetchall()
    return sales

def get_detail(id):
    cnx,cursor=connectsql()
    x="select nickname,sale_name,sale_desc,sale_price,sale_newold,sale_contact,sale_img from seconds,users where seconds.username=users.username and seconds.id=%d" %(id)
    cursor.execute(x)
    sale=cursor.fetchall()
    sale=sale[0]
    return sale

def get_detail(id):
    cnx,cursor=connectsql()
    x="select nickname,sale_name,sale_desc,sale_price,sale_newold,sale_contact,sale_img from seconds,users where seconds.username=users.username and seconds.id=%d" %(id)
    cursor.execute(x)
    sale=cursor.fetchall()
    if len(sale)==0:
        return 'fail'
    else:
        sale=sale[0]
        return sale
def get_comments(sale_id):
    cnx,cursor=connectsql()
    x="select id,parent_id,users.nickname,content,time from comments,users where comments.username=users.username and sale_id=%d" %(sale_id)
    cursor.execute(x)
    res=cursor.fetchall()
    comments=[]
    for one in res:
        if one[1]==0:
            comments.append([one,0])
        else:
            x="select id,parent_id,users.nickname,content,time from comments,users where comments.username=users.username and id=%d and sale_id=%d" %(one[1],sale_id)
            cursor.execute(x)
            two=cursor.fetchall()
            comments.append([one,two[0]])
    return comments

def addcomment(sale_id,parent_id,username,content):
    cnx,cursor=connectsql()
    x="insert into comments(sale_id,parent_id,username,content) values (%d,%d,'%s','%s')" %(sale_id,parent_id,username,content)
    cursor.execute(x)
    cnx.commit()
    return 'success'


def resiger(username,password,nickname,sex):
    cnx,cursor=connectsql()
    x="select count(*) from users where username='%s'" % (username)
    cursor.execute(x)
    counts=cursor.fetchall()
    if counts[0][0]==1:
        return 'repeat'
    else:
        x="insert into users(username,nickname,password,sex) values ('%s','%s','%s',%d)" %(username,password,nickname,int(sex))
        cursor.execute(x)
        cnx.commit()
        return 'success'

def get_mysale(username):
    cnx,cursor=connectsql()
    x="select nickname from users where username='%s'" %(username)
    cursor.execute(x)
    nickname=cursor.fetchall()
    nickname=nickname[0][0]
    x="select id,sale_name from seconds where username='%s'" %(username)
    cursor.execute(x)
    mysales=cursor.fetchall()
    return [nickname,mysales]

def connectsql():
    cnx = mysql.connector.connect(user=MysqlConInfo[0], password=MysqlConInfo[1], host=MysqlConInfo[2],
                                  database=MysqlConInfo[3], charset='utf8')
    cursor = cnx.cursor()
    return cnx,cursor


#salelist()
get_detail(1)