from flask import Flask, render_template, url_for, redirect, request, make_response
import pymongo
import json
import copy
import traceback

app = Flask(__name__)

# Get the  collection of the database from mongodb


def getCollection():
    return pymongo.MongoClient().off.products

# Ceate a menu according to requirements


def menu(energy, salt, sugar, fat, car, proteins, country):
    query = {}
    if energy != None:
        energy = float(energy) / 4
        query['nutriments.energy'] = {'$gte': energy}
    if salt != None:
        salt = float(salt) / 4
        query['nutriments.salt'] = {'$lte': salt}
    if sugar != None:
        sugar = float(sugar) / 4
        query['nutriments.sugars'] = {'$lte': sugar}
    if fat != None:
        fat = float(fat) / 4
        query['nutriments.fat'] = {'$lte': fat}
    if car != None:
        car = float(car) / 4
        query['nutriments.carbohyrates'] = {'$lte': car}
    if proteins != None:
        proteins = float(proteins)
        query['nutriments.proteins'] = {'$lte': proteins}
    if country != None:
        query['countries'] = country

    collection = getCollection()

    # meat
#query['categories'] = {'$regex':'meat'}
    tmp = getCollection().find(query, limit=28)
#	meat = copy.deepcopy(tmp)
# print query, meat.count()

    # vegetables
#	query['categories'] = {'$regex':'vegetable'}
#	tmp  = getCollection().find(query)
#	vegetable = copy.deepcopy(tmp)
#	print query,vegetable.count(), meat.count()
    print query, tmp.count()
    # fish
#	query['categories'] = {'$regex':'fish'}
#	tmp = collection.find(query)
#	fish = copy.deepcopy(tmp)
# print query,fish.count()

    # fruits
#	query['categories'] = {'$regex':'fruit'}
#	tmp = collection.find(query)
#	fruit = copy.deepcopy(tmp)
#	print meat.count(), vegetable.count(), fish.count(), fruit.count()

    result = {}
#	if meat.count() < 7 or vegetable.count()<7 or fish.count()<7 or fruit.count()<7:
    if tmp.count() < 28:
        return None

    result['energy'] = []
    result['menu_text'] = ''
#	print meat.count(), vegetable.count(), fish.count(), fruit.count()
# print meat[0]['nutriments']['energy']
#	print fish[0]['nutriments']['energy']
#	print vegetable[0]['nutriments']['energy']
#	print fruit[0]['nutriments']['energy']

    i = 0
    while i < 28:
        result['energy'].append(float(tmp[i]['nutriments']['energy']) + float(tmp[i + 1]['nutriments']['energy']) + float(tmp[i + 2]['nutriments']['energy']) + float(tmp[i + 3]['nutriments']['energy']))
        result['menu_text'] += tmp[i]['product_name'] + '@' + tmp[i + 1]['product_name'] + '@' + tmp[i + 2]['product_name'] + '@' + tmp[i + 3]['product_name'] + '###'
        i += 4
    return result


@app.route('/')
def hello():
    response = make_response('hello')
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
# return render_template('hello.html')


@app.route('/search/<str>')
def searchStr(str):
    collection = getCollection()
    res = collection.find({'product_name': {'$regex': str, '$options': "$i"}}).limit(7)
    data = {}
    data['data'] = []
    data['error_msg'] = ''
    for item in res:
        tmp = {}
        tmp['id'] = item['code']
        tmp['name'] = item['product_name']
        data['data'].append(tmp)
    if res.count() == 0:
        data['error_msg'] = 'Did not find any food with string ' + str
    response = make_response(json.dumps(data))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/id/<code>')
def searchById(code):
    collection = getCollection()
    tmp = collection.find({"code": code})
    res = {}
    res['error_msg'] = ''
    res['data'] = {}
    if tmp.count() == 0:
        res['error_msg'] = 'Did not find the food with id equals ' + code
    else:
        tmp = tmp[0]
        res['data']['id'] = tmp['code']
        res['data']['name'] = tmp['product_name']
        res['data']['quantity'] = tmp['quantity']
        res['data']['brands'] = tmp['brands']
        res['data']['countries_en'] = tmp['countries']
        res['data']['main_category_en'] = tmp['categories']
        if tmp['nutriments'].has_key('energy_100g'):
            res['data']['energy_100g'] = tmp['nutriments']['energy_100g']
        else:
            res['data']['energy_100g'] = '0'

        if tmp['nutriments'].has_key('fat_100g'):
            res['data']['fat_100g'] = tmp['nutriments']['fat_100g']
        else:
            res['data']['fat_100g'] = '0'

        if tmp['nutriments'].has_key('carbohydrates_100g'):
            res['data']['carbohydrates_100g'] = tmp['nutriments']['carbohydrates_100g']
        else:
            res['data']['carbohydrates_100g'] = '0'

        if tmp['nutriments'].has_key('sugars_100g'):
            res['data']['sugars_100g'] = tmp['nutriments']['sugars_100g']
        else:
            res['data']['sugars_100g'] = '0'

        if tmp['nutriments'].has_key('proteins_100g'):
            res['data']['proteins_100g'] = tmp['nutriments']['proteins_100g']
        else:
            res['data']['proteins_100g'] = '0'

        if tmp['nutriments'].has_key('salt_100g'):
            res['data']['salt_100g'] = tmp['nutriments']['salt_100g']
        else:
            res['data']['salt_100g'] = '0'

        if tmp['nutriments'].has_key('sodium_100g'):
            res['data']['sodium_100g'] = tmp['nutriments']['sodium_100g']
        else:
            res['data']['sodium_100g'] = '0'
    response = make_response(json.dumps(res))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/menu')
def createMenu():
    try:
        params = request.args
        energy_gt = params.get('energy_gt')
        salt_lt = params.get('salt_lt')
        sugar_lt = params.get('sugar_lt')
        fat_lt = params.get('fat_lt')
        carbohydrates_lt = params.get('carbohydrates_lt')
        proteins_lt = params.get('proteins_lt')
        country = params.get('country')

        res = {}
        res['data'] = {}
        res['error_msg'] = ''
        tmp = menu(energy_gt, salt_lt, sugar_lt, fat_lt, carbohydrates_lt, proteins_lt, country)
        if tmp is None:
            res['error_msg'] = 'Counld not find a proper menu'
        else:
            res['data'] = tmp
        response = make_response(json.dumps(res))
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    except:
        print(traceback.format_exc())


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5001)
