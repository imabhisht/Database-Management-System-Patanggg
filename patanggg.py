from pyinvoice.templates import SimpleInvoice
from pyinvoice.models import InvoiceInfo, ServiceProviderInfo, ClientInfo, Item, Transaction
from datetime import datetime, date
from Invoice_Generation import invoice_generator as call
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
import eel
import os
import ast
import subprocess
import datetime
import errno
if not firebase_admin._apps:
    cred = credentials.Certificate('alpha_key.json')
    default_app = firebase_admin.initialize_app(cred)
db = firestore.client()
eel.init('Web')
global all_products_list
global all_deals_list
all_products_list = json.loads(
    (((db.collection('app_data').document('products')).get()).to_dict())["all_products"])
all_deals_list = json.loads(
    (((db.collection('app_data').document('deals')).get()).to_dict())["all_deals"])


class Database:
    def __init__(self, odid=None, odnm=None, usid=None, fn=None, ln=None, ph=None, em=None, ad=None, pc=None, dj=None, itnm=None, itds=None, itpr=None, itod=None, itdy=None, itst=None):
        self.userid = usid
        self.ordernum = odnm
        self.orderid = odid
        self.firstname = fn
        self.lastname = ln
        self.address = ad
        self.email = em
        self.phone = ph
        self.pincode = pc
        self.datejoin = dj
        self.itemname = itnm
        self.itemdesc = itds
        self.itemperrate = itpr
        self.itemordered = itod
        self.itemdate = itdy

    def List_Order(self, search):
        ref = db.collection(search).stream()
        xamp = []
        for x in ref:
            Orders = Database(odid=x.id, usid=(x.to_dict())["userId"], odnm=(
                (x.id[24]+x.id[27]+x.id[30]+x.id[33]).upper()))
            xamp.append(json.dumps(Orders.__dict__))
        return xamp

    def User_Info(self, user_query):
        user_info_ref = (db.collection('users').document(
            user_query).get()).to_dict()
        xamp = []
        Info = Database(fn=user_info_ref["firstName"], ln=user_info_ref["lastName"], ph=user_info_ref["phone"],
                        em=user_info_ref["email"], ad=user_info_ref["address"], pc=user_info_ref["pincode"], dj=str(user_info_ref["dateJoined"]))
        xamp.append(json.dumps(Info.__dict__))
        return xamp

    def order_info(self, user_query, order_query, req=None):
        user_ord_ref = ((db.collection('users').document(user_query).collection(
            'orders').document(order_query)).get()).to_dict()
        user_odprod_list = []
        user_oddeal_list = []
        user_prod_dict = ast.literal_eval(user_ord_ref["products"])
        user_deal_dict = ast.literal_eval(user_ord_ref["deals"])
        [user_odprod_list.append(z) for z in user_prod_dict]
        [user_oddeal_list.append(z) for z in user_deal_dict]
        if req == 'request':
            return user_odprod_list, user_oddeal_list
        products_class = []
        deals_class = []
        for i in all_products_list:
            if i["id"] in user_odprod_list:
                product_class = Database(
                    itnm=i["name"], itpr=i["pricePerUnit"], itst=i["inStock"], itod=user_prod_dict[i["id"]])
                products_class.append(json.dumps(product_class.__dict__))

        for i in all_deals_list:
            if i["id"] in user_oddeal_list:
                deal_class = Database(
                    itnm=i["name"], itpr=i["price"], itst=i["inStock"], itod=user_deal_dict[i["id"]])
                deals_class.append(json.dumps(deal_class.__dict__))

        return products_class, deals_class


def order_system_temp(user_query, order_query):
    user_ord_ref = ((db.collection('users').document(user_query).collection(
        'orders').document(order_query)).get()).to_dict()
    system_ref = (
        (db.collection('system_info').document('temp')).get()).to_dict()
    system_product = ast.literal_eval(system_ref['products'])
    system_deal = ast.literal_eval(system_ref['deals'])
    products_dict = ast.literal_eval(user_ord_ref['products'])
    deals_dict = ast.literal_eval(user_ord_ref['deals'])

    # Looping For Product Updates
    xamp = {}
    for j in system_product:
        xamp.update({j: system_product[j]})

    for i in products_dict:
        for j in xamp:
            if i == j:
                alpha = int(xamp[j])+int(products_dict[i])
                xamp.update({i: str(alpha)})
                break
    ref = db.collection('system_info').document('temp')
    ref.set({'products': str(xamp)}, merge=True)

    # Looping For Deal Updates
    xamp = {}
    for j in system_deal:
        xamp.update({j: system_deal[j]})

    for i in deals_dict:
        for j in xamp:
            if i == j:
                alpha = int(xamp[j])+int(deals_dict[i])
                xamp.update({i: str(alpha)})
                break
    ref = db.collection('system_info').document('temp')
    ref.set({'deals': str(xamp)}, merge=True)


def appdata_system_temp():

    temp_ref = db.collection('system_info').document('temp')
    xamp = {}
    for i in all_products_list:
        xamp.update({i["id"]: '0'})

    temp_ref.set({"products": str(xamp)}, merge=True)

    xamp = {}
    for i in all_deals_list:
        xamp.update({i["id"]: '0'})

    temp_ref.set({"deals": str(xamp)}, merge=True)


def user_info(user_search):
    info_class = Database.User_Info(None, user_search)
    # print(info_class)
    return json.dumps(info_class)


def order_info(user_search, order_search):
    products_class, deals_class = Database.order_info(
        None, user_search, order_search)
    #print(products_class, deals_class)
    products_class = json.dumps(products_class)
    deals_class = json.dumps(deals_class)
    return products_class, deals_class


def store(ordernumber):
    today = str(datetime.date.today())
    if not os.path.exists('Orders'+'/AdminOrders/'+today+'/'):
        os.makedirs('Orders'+'/AdminOrders/'+today+'/')

    order_file = open('Orders'+'/AdminOrders/'+today +
                      '/'+ordernumber+".txt", "w")
    product_list = []
    product_dict = ast.literal_eval(
        (((db.collection('system_info').document('temp')).get()).to_dict())["products"])
    [product_list.append(z) for z in product_dict]
    order_file.write("Products ".ljust(100, '-') + "\n\n")
    for i, val in enumerate(all_products_list):
        if val["id"] in product_list:
            data = str(val["id"]) + "  " + str(val["name"]).ljust(50,
                                                                  ' ') + "  " + str(product_dict[val["id"]]) + "\n\n"
            order_file.write(data)
    order_file.write("".ljust(100, '-') + "\n\n")

    deal_list = []
    deal_dict = ast.literal_eval(
        (((db.collection('system_info').document('temp')).get()).to_dict())["deals"])
    [deal_list.append(z) for z in deal_dict]
    order_file.write("\nDeals ".ljust(100, '-') + "\n\n")
    for i, val in enumerate(all_deals_list):
        if val["id"] in deal_list:
            data = str(val["id"]) + "  " + str(val["name"]).ljust(50,
                                                                  ' ') + "  " + str(deal_dict[val["id"]]) + "\n\n"
            order_file.write(data)
    order_file.write("".ljust(100, '-') + "\n\n")
    order_file.close()


def load_order():

    orders_num_ref = db.collection('system_info').document('info')
    orders_num = (((orders_num_ref).get()).to_dict())["order"]
    orders_num_string = "orders_" + str(orders_num)
    store(orders_num_string)

    temp_ref = db.collection('system_info').document('temp')

    orders_data = ((temp_ref).get()).to_dict()
    # print(orders_data)
    order_ref = db.collection('system_info').document(orders_num_string)
    for z in orders_data:
        order_ref.set({z: orders_data[z]}, merge=True)

    orders_num_ref.set({"order": int(orders_num + 1)})


def arrange_list(data1, data2):
    order_list = []
    orders_pd = ast.literal_eval(
        (((db.collection('system_info').document('temp')).get()).to_dict())[data1])
    # print(orders_pd)
    [order_list.append(z) for z in orders_pd]
    xamp_product = []
    for i, val in enumerate(data2):
        if val["id"] in order_list:
            order_details = Database(
                itnm=val["name"], itod=orders_pd[val["id"]], odid=val["id"])

            xamp_product.append(json.dumps(order_details.__dict__))
    json_string = json.dumps(xamp_product)
    return json_string


@eel.expose
def list_order(search):
    list_class = Database.List_Order(None, search)
    return json.dumps(list_class)


@eel.expose
def status_change(order_query, user_query, r_status, c_status):
    if r_status == 'DelayApproval':
        db.collection(c_status).document(order_query).delete()
        change_ref = db.collection('users').document(
            user_query).collection('orders').document(order_query)
        result_ref = db.collection('WaitingForApproval').document(order_query)
        change_ref.set({'status': 'WaitingForApproval'}, merge=True)
        result_ref.set(
            {'orderId': order_query, 'userId': user_query}, merge=True)

    elif r_status == 'ShippingReady':
        db.collection(c_status).document(order_query).delete()
        change_ref = db.collection('users').document(
            user_query).collection('orders').document(order_query)
        result_ref = db.collection('ShippingReady').document(order_query)
        change_ref.set({'status': 'Approved'}, merge=True)
        result_ref.set(
            {'orderId': order_query, 'userId': user_query}, merge=True)
    else:
        db.collection(c_status).document(order_query).delete()
        change_ref = db.collection('users').document(
            user_query).collection('orders').document(order_query)
        result_ref = db.collection(r_status).document(order_query)
        change_ref.set({'status': r_status}, merge=True)
        result_ref.set(
            {'orderId': order_query, 'userId': user_query}, merge=True)

    print("\n>>Successfully changed status for " +
          order_query + " to " + r_status)


@eel.expose
def info_press(user_search, order_search):
    alpha = user_info(user_search)
    beta, charlie = order_info(user_search, order_search)
    return alpha, beta, charlie


@eel.expose
def orders_generate():
    approved_read = db.collection('Approved').stream()
    for i in approved_read:
        order_system_temp(i.to_dict()["userId"], i.id)
        status_change(i.id, i.to_dict()["userId"], 'ShippingReady', 'Approved')

    return 'Sucess'


@eel.expose
def make_order_from_temp():
    load_order()
    shipping_read = db.collection('ShippingReady').stream()
    for i in shipping_read:
        order_system_temp(i.to_dict()["userId"], i.id)
        status_change(i.id, i.to_dict()["userId"], 'Shipping', 'ShippingReady')

    appdata_system_temp()

    return 'Sucess'


@eel.expose
def list_temporders():
    alpha = arrange_list('products', all_products_list)
    beta = arrange_list('deals', all_deals_list)
    return alpha, beta


def invoice_creation(user_id, order_id, today):
    # if not os.path.exists('Orders/'+'CustomersInvoice/'+today+'/'):
    # os.makedirs('Orders/'+'CustomerInvoice/'+today+'/')
    """
    if not os.path.exists('Orders/'+today+'/Reciept'):
        os.makedirs('Orders/'+today+'/Reciept')"""

    order_info = (db.collection('users').document(user_id).collection(
        'orders').document(order_id).get()).to_dict()
    user_info = (db.collection('users').document(user_id).get()).to_dict()
    order_deals = ast.literal_eval(order_info["deals"])
    order_products = ast.literal_eval(order_info["products"])
    order_deal_list = []
    order_products_list = []
    [order_deal_list.append(z) for z in order_deals]
    [order_products_list.append(z) for z in order_products]
    pdf_name = order_id + "-invoice.pdf"
    user_address_sep = (user_info["address"]).split("@#$%^&")
    # INVOICE PRINTING FOR ORDER INFO
    invoice = call.InvoiceGenerator(
        sender="Patanggg Digital Kite Shoppe",
        to=user_info["firstName"] + " " +
        user_info["lastName"] + ", " + user_address_sep[0] +
        ", " + user_address_sep[1] + ", " + user_address_sep[2],
        logo="https://drive.google.com/uc?export=download&id=1f5Az4YemoLnNF5na80zk8aMeNV5US0bH",
        # logo="https://www.brandingmag.com/wp-content/uploads/2012/08/new-microsoft-logo-2.png",
        number=(order_id[24]+order_id[27]+order_id[30]+order_id[33]).upper(),
        notes="Thanks for using Patanggg App!!!",
        shipping=50
    )
    """
    # RECIEPT PRINTING FOR ORDER INFO
    Reciept_name = 'Orders/'+today+'/Reciept/' + pdf_name
    doc = SimpleInvoice(Reciept_name)
    doc.client_info = ClientInfo(name=user_info["firstName"] + " " +
                                 user_info["lastName"],
                                 street=user_info["address"],
                                 city='ask manav to separate the city with address',
                                 state='This too',
                                 post_code=user_info["pincode"],
                                 )"""

    # DEALS PRINTING
    for i, val in enumerate(all_deals_list):
        if val["id"] in order_deal_list:
            # print(val["name"],val["originalPrice"],order_deals[val["id"]])

            # INVOICE
            invoice.add_item(
                name=val["name"],
                quantity=int(order_deals[val["id"]]),
                unit_cost=int(val["price"]),
            )
            """
            # RECIEPT
            doc.add_item(Item(val["name"], 'Check App', int(
                order_deals[val["id"]]), val["price"]))"""

    # PRODUCT PRINTING
    for i, val in enumerate(all_products_list):
        if val["id"] in order_products_list:
            # print(val["name"],val["originalPrice"],order_deals[val["id"]])

            # INVOICE
            invoice.add_item(
                name=val["name"],
                quantity=int(order_products[val["id"]]),
                unit_cost=int(val["pricePerUnit"]),
            )
            """
            # RECIEPT
            doc.add_item(Item(val["name"], 'Check App', int(
                order_products[val["id"]]), val["pricePerUnit"]))"""
    """
    doc.set_bottom_tip(
        "Email: example@example.com<br />Don't hesitate to contact us for any questions.")
    doc.finish()"""

    try:
        os.mkdir('Orders/'+'CustomerInvoice/'+today+'/')
    except OSError as e:
        if e.errno == errno.EEXIST:
            print('Directory not created.')
        else:
            raise

    invoice.download('Orders/'+'CustomerInvoice/'+today+'/'+pdf_name)
    print("\n"+order_id + "  " + "Successfully Printed")


@ eel.expose
def order_shipped():
    approved_read = db.collection('Shipping').stream()
    today = str(datetime.date.today())
    for i in approved_read:
        invoice_creation(i.to_dict()["userId"], i.id, today)
        status_change(i.id, i.to_dict()["userId"], 'Shipped', 'Shipping')

    return 'Sucess'


# order_shipped()
# orders_generate()
# appdata_system_temp()
eel.start('index.html', size=(1000, 600))
# invoice_creation('GI22I1ROYkfk3rcRKxzSSRfuRa53','6efb0cd1-acc9-4acc-bd22-7b3abd97e645')
# list_temporders()
