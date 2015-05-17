# -*- coding:utf-8 -*-
__author__ = 'Mouse'
import settings as Settings
import tornado.web
import json
import qiniu
import utils
import mysql.connector
# 主页处理


# 主页，二手商品列表
# 现在服务器生成一半的商品列表，然后再使用json生成一部分列表
class IndexHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        page_number=self.get_argument('p',1)
        page_number=int(page_number)
        if page_number<=1:
            page_number=1
        salelists=utils.salelist(page_number)
        self.render('index.html',salelists=salelists,page_number=page_number)
#生成另一个部分的Json数据，然后在客户端生成
class SaleList_Json_Handler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        checkid=self.get_cookie("checkid")
        page_number=self.get_argument('p')
        page_number=int(page_number)
        jsonstr=utils.salelist_json(page_number)
        self.write(jsonstr)

class AddSaleHandler(tornado.web.RequestHandler):
    def post(self, *args, **kwargs):
        username=self.get_cookie("username")
        sale_name=self.get_argument('sale_name')
        sale_desc=self.get_argument('sale_desc')
        sale_price=self.get_argument('sale_price')
        sale_newold=self.get_argument('sale_newold')
        sale_contact=self.get_argument('sale_contact')
        img_name=self.get_argument('img_name')
        sale_price=int(sale_price)
        sale_newold=int(sale_newold)
        utils.addsale(username,sale_name,sale_desc,sale_contact,sale_price,sale_newold,img_name)
        resultcode={'resultcode':'success'}
        jsonstr=json.dumps(resultcode,ensure_ascii=False)
        self.write(jsonstr)

class LoginHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        self.render('login.html')
    def post(self, *args, **kwargs):
        username=self.get_argument('username')
        password=self.get_argument('password')
        resultcode='fail'
        if utils.CheckAuthority(username,password):
            self.set_cookie('username',username)
            self.set_cookie('password',password)
            resultcode='success'
        resultcode={'resultcode':resultcode}
        jsonstr=json.dumps(resultcode,ensure_ascii=False)
        self.write(jsonstr)

class ResigerHandler(tornado.web.RequestHandler):
    def post(self, *args, **kwargs):
        username=self.get_argument('username')
        password=self.get_argument('password')
        nickname=self.get_argument('nickname')
        sex=self.get_argument('sex')
        restr=utils.resiger(username,nickname,password,sex)
        self.set_cookie('username',username)
        self.set_cookie('password',password)
        resultcode={'resultcode':restr}
        jsonstr=json.dumps(resultcode,ensure_ascii=False)
        self.write(jsonstr)

class QiniuHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        q = qiniu.Auth('WH4btY4Li6M3jd_fq5JdYHutVe0Heq4BV1k25a64', 'jNskEoFcyN4lpj1Q28YMaRGeWsog6OnmXvWEJTlJ')
        key = 'hello'
        token = q.upload_token('winter1ife')
        token={'token':token}
        jsonstr=json.dumps(token,ensure_ascii=False)
        self.write(jsonstr)

class DetailHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        username=self.get_cookie("username")
        id=self.get_argument('id')
        id=int(id)
        sale_detail=utils.get_detail(id)
        if sale_detail=='fail':
            self.redirect('/')
        else:
            sale_comments=utils.get_comments(id)
            self.render('detail.html',sale_detail=sale_detail,sale_comments=sale_comments,id=id,username=username)

class CommentHandler(tornado.web.RequestHandler):
    def post(self, *args, **kwargs):
        username=self.get_cookie("username")
        password=self.get_cookie("password")
        if utils.CheckAuthority(username,password):
            parent_id=self.get_argument('parent_id',0)
            sale_id=self.get_argument('sale_id')
            content=self.get_argument('content')
            parent_id=int(parent_id)
            sale_id=int(sale_id)
            resultcode=utils.addcomment(sale_id,parent_id,username,content)
            res={'resultcode':resultcode}
            jsonstr=json.dumps(res,ensure_ascii=False)
            self.write(jsonstr)
        else:
            res={'resultcode':'notlog'}
            jsonstr=json.dumps(res,ensure_ascii=False)
            self.write(jsonstr)

class MySettingHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        username=self.get_cookie("username")
        password=self.get_cookie('password')
        if utils.CheckAuthority(username,password):
            nickname,mysales=utils.get_mysale(username)
            self.render('setting.html',mysales=mysales,username=username,nickname=nickname)
        else:
            self.redirect('/login')
    def post(self, *args, **kwargs):
        opcode=self.get_argument('opcode')
        username=self.get_cookie('username')
        password=self.get_cookie('password')
        if utils.CheckAuthority(username,password):
            if opcode=='del':
                sale_id=self.get_argument('sale_id')
                sale_id=int(sale_id)
                if utils.delsale(username,password,sale_id):
                    res={'resultcode':'success'}
                else:
                    res={'resultcode':'fail'}
            elif opcode=='logout':
                self.clear_cookie('username')
                self.clear_cookie('password')
                res={'resultcode':'success'}
            else:
                res={'resultcode':'fail'}
        else:
            res={'resultcode':'fail'}
        jsonstr=json.dumps(res,ensure_ascii=False)
        self.write(jsonstr)
class HelpHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        self.render('help.html')
