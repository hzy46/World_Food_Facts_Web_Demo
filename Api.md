## API 说明

### 1. 搜索
```
GET http://<ip>:<port>/search/搜索的字符串
```

返回
```
{
    "data":[
        {
            "id": "食物的id",
            "name": "食物的名称"
        },
        {
            "id": "食物的id",
            "name": "食物的名称"
        }
    ],   
    "error_msg": ""
}
```

如果没有相关结果data直接返回空列表。

**最多返回5个结果。** 

### 2. 查询单个食物

```
GET http://<ip>:<port>/id/食物的id
```

返回
```
{
    "data":{
        "id": "食物的id",
        "name": "食物的名称",
        "url":"url",
        "quantity":"",
        "brands":"",
        "countries_en":"",
        "main_category_en":"",
        "energy_100g": 0,
        "fat_100g":0,
        "carbohydrates_100g": 0,
        "sugars_100g": 0,
        "fiber_100g": 0,
        "proteins_100g": 0,
        "salt_100g": 0,
        "sodium_100g": 0,
        "vitamin_a_100g": 0,
        "vitamin_b1_100g": 0,
        "vitamin_b2_100g": 0,
        "vitamin_c_100g": 0,
        "vitamin_d_100g": 0,
        "vitamin_e_100g": 0
    },
    "error_msg": ""
}
```


### 3. 菜谱生成

```
GET http://<ip>:<port>/menu?energy_gt=200&sugar_lt=20&fat_lt=30&salt_lt=1&carbohydrates_lt=20&proteins_lt=1
```

约定
1. 给定的都是每天平均的量（最后只要应该只要平均达到这个标准就行），而输出需要输出七天的结果
2. _gt表示greater than, _lt表示less than。也就是说只有energy有大于的要求。其他都是小于的要求。（为了处理方便）
3. 如果给的时候某一项缺失，代表这一项没有要求，可以随意

输出
```
{
    "data":{
        "energy": [45,2,23,100,230,33,132],
        "menu_text": "生成的菜谱。七天的，根据产品名称组织一下语言即可"
    },
    "error_msg": ""
}
```

energy表示七天，每天的energy总和。方便网页做一个图表。