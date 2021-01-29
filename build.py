import eel
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import uuid
import os
import datetime
if not firebase_admin._apps:
    cred = credentials.Certificate('alpha_key.json')
    default_app = firebase_admin.initialize_app(cred)
db = firestore.client()
eel.init('Web')

global all_products_list
all_products_list = json.loads(
    (((db.collection('app_data').document('products')).get()).to_dict())["all_products"])
global all_deals_list
all_deals_list = json.loads(
    (((db.collection('app_data').document('deals')).get()).to_dict())["all_deals"])

if not os.path.exists('Backup/'):
    os.makedirs('Backup/')

rightnow = str(datetime.datetime.now())
filebackup = open("Backup/"+rightnow+".txt", "w")
filebackup.write(str(
    json.dumps(all_products_list)))
filebackup.close
print("Created App Data Backup at Backup Folder... Use this file in case of Emergency")


@eel.expose
def fortox(datax, dataid):
    datax = json.loads(datax)
    for a, i in enumerate(all_products_list):
        if i["id"] == dataid:
            al = all_products_list.pop(a)
            print("removing: ", al)

    all_products_list.append(datax)
    """uploadRef = db.collection('app_data').document('products')
    uploadRef.set({'all_products': str(
        json.dumps(all_products_list))}, merge=True)"""

    print(str(
        json.dumps(all_products_list)))

    return 'Success'


@ eel.expose
def charlie(datax):
    for a, i in enumerate(all_products_list):
        if i["id"] == datax:
            print("removing: ")
            all_products_list.pop(a)
    """
    uploadRef = db.collection('app_data').document('products')
    uploadRef.set({'all_products': str(
        json.dumps(all_products_list))}, merge=True)"""

    print(str(
        json.dumps(all_products_list)))

    return 'Success'


class pyBuilder:
    def __init__(self, id, name, itemcat, desc, instock, itemor, itemqr, itemrate, prolist, urllist, um, isdel):
        self.item_id = id
        self.item_name = name
        self.item_category = itemcat
        self.item_desc = desc
        self.item_stock = instock
        self.item_or = itemor
        self.item_qr = itemqr
        self.item_rate = itemrate
        self.item_prolist = prolist
        self.item_urllist = urllist
        self.item_isDeleted = isdel
        self.item_unitmeasure = um


@ eel.expose
def list_items():
    xamp = []
    for i in all_products_list:
        try:
            datai = pyBuilder(id=i["id"], itemcat=i["category"], name=i["name"], desc=i["desc"], instock=i["inStock"],
                              itemor=i["maxQuantityInUnitsPerOrder"], itemqr=i["quantityPerUnit"], itemrate=i["pricePerUnit"], prolist=i["properties"], urllist=i["images"], um=i["unitMeasure"], isdel=i["isDeleted"])
            xamp.append(json.dumps(datai.__dict__))
        except:
            datai = pyBuilder(id=i["id"], itemcat=i["category"], name=i["name"], desc=i["desc"], instock=i["inStock"],
                              itemor=i["maxQuantityInUnitsPerOrder"], itemqr=i["quantityPerUnit"], itemrate=i["pricePerUnit"], prolist=i["properties"], urllist=i["images"], um=None, isdel=i["isDeleted"])
            xamp.append(json.dumps(datai.__dict__))

    return json.dumps(xamp)


@ eel.expose
def megaton(find_id):
    for i in all_products_list:
        if i["id"] == find_id:
            xamp = []
            try:
                datai = pyBuilder(id=i["id"], itemcat=i["category"], name=i["name"], desc=i["desc"], instock=i["inStock"],
                                  itemor=i["maxQuantityInUnitsPerOrder"], itemqr=i["quantityPerUnit"], itemrate=i["pricePerUnit"], prolist=i["properties"], urllist=i["images"], um=i["unitMeasure"], isdel=i["isDeleted"])
                xamp.append(json.dumps(datai.__dict__))
            except:
                datai = pyBuilder(id=i["id"], itemcat=i["category"], name=i["name"], desc=i["desc"], instock=i["inStock"],
                                  itemor=i["maxQuantityInUnitsPerOrder"], itemqr=i["quantityPerUnit"], itemrate=i["pricePerUnit"], prolist=i["properties"], urllist=i["images"], um=None, isdel=i["isDeleted"])
                xamp.append(json.dumps(datai.__dict__))

            return json.dumps(xamp)


@ eel.expose
def uuid_creator():
    return str(uuid.uuid4())


eel.start('buildtable.html', size=(1000, 600))
