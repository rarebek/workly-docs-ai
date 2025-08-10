---
title: "Заработная плата (payroll, fine, salary)"
url: "https://dev.workly.io/#заработная-плата-payroll-fine-salary"
section_order: 9
scraped_at: "2025-08-10T13:45:11.949Z"
---

# [](#Заработная-плата-payroll-fine-salary "Заработная плата (payroll, fine, salary)")Заработная плата (payroll, fine, salary)

Назначение изменение, удаление заработной платы, ставки, правила  
заработной платы, автоматических штрафов.

## [](#Список-ставок-сотрудников-employee-salaries "Список ставок сотрудников (employee salaries)")Список ставок сотрудников (employee salaries)

Выполнение запроса без указания параметров возвращают весь список доступных сотрудников для авторизованного пользователя.

### [](#HTTP-Запрос "HTTP Запрос")HTTP Запрос

`GET "https://api.workly.io/v1/payroll/salaries"`

```
curl --request GET \
  --url https://api.workly.io/v1/payroll/salaries \
  --header 'authorization: Bearer 25c9ec0bc08de9331b8aaa338495a171ff5dcf61'
  --header 'limit: 50'

```

параметр

Описание

limit

Количество страниц для загрузки, default 50 сотрудников

f

Ключ для типа запроса принимает несколько значений(department, employee) в зависимости от указанного параметра в ответе запроса будут соответствующие объекты. Если ключ отправлен пустым, он будет искаться в авторизованных отделах. Если вызвать ключ без параметра, то вернется ошибка.

ids

Здесь указываются integer параметры для запроса по типу указанному в “f” ключе (к примеру: 1,12,123,1234)

### [](#Поиск-по-табельному-номеру "Поиск по табельному номеру ")Поиск по табельному номеру  

### [](#HTTP-Запрос-1 "HTTP Запрос")HTTP Запрос

`GET https://api.workly.io/v1/payroll/salaries?f=department&ids=11469`

### [](#Параметры-ответа "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
    "items": [

        {
            "department_id": 11469,
            "employee_id": 98178,
            "last_name": "test",
            "first_name": "tes",
            "patronymic": "test",
            "photos": {
                "small": "https://app.workly.io/images/employee/40/1266/98178.png",
                "medium": "https://app.workly.io/images/employee/120/1266/98178.png"
            },
            "employeeSalaries": [
                {
                    "id": 108660,
                    "rate": "1000.00",
                    "start_date": "2020-09-01",
                    "end_date": "2020-09-03",
                    "type_col": 1
                },
                ...
            ]
        },
        ...
    ],
    "_meta": {
        "totalCount": 5,
        "pageCount": 1,
        "currentPage": 1,
        "perPage": 50
    }
}

```

Object| [person salaries Object](#personSalaries-закрепленные-ставки)

## [](#Список-правил-заработной-платы-сотрудников-employee-payrolls "Список правил заработной платы сотрудников (employee payrolls)")Список правил заработной платы сотрудников (employee payrolls)

Выполнение запроса без указания параметров возвращают весь список доступных сотрудников для авторизованного пользователя.

### [](#HTTP-Запрос-2 "HTTP Запрос")HTTP Запрос

`GET "https://api.workly.io/v1/payroll/payrolls"`

```
curl --request GET \
  --url https://api.workly.io/v1/payroll/payrolls \
  --header 'authorization: Bearer 25c9ec0bc08de9331b8aaa338495a171ff5dcf61'
  --header 'limit: 50'

```

параметр

Описание

limit

Количество страниц для загрузки, default 50 сотрудников

f

Ключ для типа запроса принимает несколько значений(department, employee) в зависимости от указанного параметра в ответе запроса будут соответствующие объекты. Если ключ отправлен пустым, он будет искаться в авторизованных отделах. Если вызвать ключ без параметра, то вернется ошибка.

ids

Здесь указываются integer параметры для запроса по типу указанному в “f” ключе (к примеру: 1,12,123,1234)

### [](#Поиск-по-табельному-номеру-1 "Поиск по табельному номеру ")Поиск по табельному номеру  

### [](#HTTP-Запрос-3 "HTTP Запрос")HTTP Запрос

`GET https://api.workly.io/v1/payroll/payrolls?f=department&ids=11469`

### [](#Параметры-ответа-1 "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
    "items": [

        {
            "department_id": 11469,
            "employee_id": 98178,
            "last_name": "test",
            "first_name": "tes",
            "patronymic": "test",
            "photos": {
                "small": "https://app.workly.io/images/employee/40/1266/98178.png",
                "medium": "https://app.workly.io/images/employee/120/1266/98178.png"
            },
            "personPayrolls": [
                {
                    "id": 14327,
                    "start_date": "2023-02-01",
                    "end_date": "9999-12-31",
                    "payrollRule": {
                        "id": 60,
                        "title": "Test",
                        "otc_algorithm_daily": true
                    }
                },
                ...
            ]
        },
        ...
    ],
    "_meta": {
        "totalCount": 5,
        "pageCount": 1,
        "currentPage": 1,
        "perPage": 50
    }
}

```

Object| [person payrolls Object](#personPayrolls-–-закрепленные-правила)

## [](#Список-автоматических-штрафов-сотрудников-employee-fines "Список автоматических штрафов сотрудников (employee fines)")Список автоматических штрафов сотрудников (employee fines)

Выполнение запроса без указания параметров возвращают весь список доступных сотрудников для авторизованного пользователя.

### [](#HTTP-Запрос-4 "HTTP Запрос")HTTP Запрос

`GET "https://api.workly.io/v1/payroll/fines"`

```
curl --request GET \
  --url https://api.workly.io/v1/payroll/fines \
  --header 'authorization: Bearer 25c9ec0bc08de9331b8aaa338495a171ff5dcf61'
  --header 'limit: 50'

```

параметр

Описание

limit

Количество страниц для загрузки, default 50 сотрудников

f

Ключ для типа запроса принимает несколько значений(department, employee) в зависимости от указанного параметра в ответе запроса будут соответствующие объекты. Если ключ отправлен пустым, он будет искаться в авторизованных отделах. Если вызвать ключ без параметра, то вернется ошибка.

ids

Здесь указываются integer параметры для запроса по типу указанному в “f” ключе (к примеру: 1,12,123,1234)

### [](#Поиск-по-табельному-номеру-2 "Поиск по табельному номеру ")Поиск по табельному номеру  

### [](#HTTP-Запрос-5 "HTTP Запрос")HTTP Запрос

`GET https://api.workly.io/v1/payroll/fines?f=department&ids=11469`

### [](#Параметры-ответа-2 "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
    "items": [

        {
            "department_id": 11469,
            "employee_id": 98178,
            "last_name": "test",
            "first_name": "tes",
            "patronymic": "test",
            "photos": {
                "small": "https://app.workly.io/images/employee/40/1266/98178.png",
                "medium": "https://app.workly.io/images/employee/120/1266/98178.png"
            },
            "personFines": [
                {
                    "id": 143,
                    "start_date": "2021-02-01",
                    "end_date": "9999-12-31",
                    "fine": {
                        "id": 20,
                        "title": "Штрафы",
                        "has_dayly_fine": 1,
                        "amount": "0.00"
                    }
                },
                ...
            ]
        },
        ...
    ],
    "_meta": {
        "totalCount": 5,
        "pageCount": 1,
        "currentPage": 1,
        "perPage": 50
    }
}

```

Object| [person fines Object](#personFines)

## [](#Список-автоматических-штрафов-fine-list "Список автоматических штрафов (fine list)")Список автоматических штрафов (fine list)

Возвращает весь список текущих автоштрафов в компании

### [](#HTTP-Запрос-6 "HTTP Запрос")HTTP Запрос

`GET "https://api.workly.io/v1/payroll/fine-list"`

```
curl --request GET \
  --url https://api.workly.io/v1/payroll/fine-list \
  --header 'authorization: Bearer 25c9ec0bc08de9331b8aaa338495a171ff5dcf61'
  --header 'limit: 50'

```

параметр

Описание

limit

Количество страниц для загрузки, default 50 сотрудников

### [](#Поиск-по-табельному-номеру-3 "Поиск по табельному номеру ")Поиск по табельному номеру  

### [](#HTTP-Запрос-7 "HTTP Запрос")HTTP Запрос

`GET https://api.workly.io/v1/payroll/fine-list`

### [](#Параметры-ответа-3 "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
    "items": [
        {
            "id": 29,
            "company_id": 1266,
            "title": "Новый Авто Штраф",
            "is_active": true,
            "has_dayly_fine": 1,
            "amount": "25.00",
            "amount_type": 0
        },
        ...
    ],
    "_meta": {
        "totalCount": 5,
        "pageCount": 1,
        "currentPage": 1,
        "perPage": 50
    }
}

```

Object| [fines list Object](#Fine)

## [](#Список-правил-заработной-платы-payroll-list "Список правил заработной платы (payroll list)")Список правил заработной платы (payroll list)

Возвращает весь список текущих правил в компании

### [](#HTTP-Запрос-8 "HTTP Запрос")HTTP Запрос

`GET "https://api.workly.io/v1/payroll/payroll-list"`

```
curl --request GET \
  --url https://api.workly.io/v1/payroll/payroll-list \
  --header 'authorization: Bearer 25c9ec0bc08de9331b8aaa338495a171ff5dcf61'
  --header 'limit: 50'

```

параметр

Описание

limit

Количество страниц для загрузки, default 50 сотрудников

### [](#Поиск-по-табельному-номеру-4 "Поиск по табельному номеру ")Поиск по табельному номеру  

### [](#HTTP-Запрос-9 "HTTP Запрос")HTTP Запрос

`GET https://api.workly.io/v1/payroll/payroll-list`

### [](#Параметры-ответа-4 "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
    "items": [
        {
            "id": 53,
            "company_id": 1266,
            "title": "KORZINKA",
            "otc_algorithm_daily": "1",
            "is_active": true
        },
        ...
    ],
    "_meta": {
        "totalCount": 5,
        "pageCount": 1,
        "currentPage": 1,
        "perPage": 50
    }
}

```

Object| [person payroll list Object](#payrollRule)

## [](#Удаление-ставки-сотрудника "Удаление ставки сотрудника")Удаление ставки сотрудника

Удаляет созданную запись ставки сотрудника используя id записи для salary  
Необходимо указать один {employee\_id} – integer параметр в запросе.  
Необходимо указать {id} – integer параметр в запросе.

### [](#HTTP-Запрос-10 "HTTP Запрос")HTTP Запрос

`DELETE "http://api.workly.io/v1/payroll/{employee_id}/delete-salary/{id}`

```
curl --request DELETE \
  --url http://api.workly.io/v1/payroll/85373/delete-salary/108663 \
  --header 'authorization: Bearer cd2becdd8368bebb8cdf8cf72e32ee2cdee4a4d5' \
  --header 'content-type: application/json' \

```

> Ответ от сервера:

```
{
  "success": true
}

```

## [](#Удаление-правила-заработной-платы "Удаление правила заработной платы")Удаление правила заработной платы

Удаляет созданную запись правила сотрудника используя id записи для payroll  
Необходимо указать один {employee\_id} – integer параметр в запросе.  
Необходимо указать {id} – integer параметр в запросе.

### [](#HTTP-Запрос-11 "HTTP Запрос")HTTP Запрос

`DELETE "http://api.workly.io/v1/payroll/{employee_id}/delete-payroll/{id}`

```
curl --request DELETE \
  --url http://api.workly.io/v1/payroll/85373/delete-salary/108663 \
  --header 'authorization: Bearer cd2becdd8368bebb8cdf8cf72e32ee2cdee4a4d5' \
  --header 'content-type: application/json' \

```

> Ответ от сервера:

```
{
  "success": true
}

```

## [](#Удаление-автоматического-штрафа-сотрудника "Удаление автоматического штрафа сотрудника")Удаление автоматического штрафа сотрудника

Удаляет созданную запись автоштрафа сотрудника используя id записи для  
fine  
Необходимо указать один {employee\_id} – integer параметр в запросе.  
Необходимо указать {id} – integer параметр в запросе.

### [](#HTTP-Запрос-12 "HTTP Запрос")HTTP Запрос

`DELETE "http://api.workly.io/v1/payroll/{employee_id}/delete-fine/{id}`

```
curl --request DELETE \
  --url http://api.workly.io/v1/payroll/85373/delete-salary/108663 \
  --header 'authorization: Bearer cd2becdd8368bebb8cdf8cf72e32ee2cdee4a4d5' \
  --header 'content-type: application/json' \

```

> Ответ от сервера:

```
{
  "success": true
}

```

## [](#Добавление-ставки-salary "Добавление ставки (salary)")Добавление ставки (salary)

Добавление записи заработной платы сотрудников доступных для авторизованного пользователя.

### [](#HTTP-Запрос-13 "HTTP Запрос")HTTP Запрос

`POST "https://api.workly.io/v1/payroll/add-salary`

```
curl --request POST \
  --url https://api.workly.io/v1/add-salary \
  --header 'authorization: Bearer b7208630a975c07725a724eccc4332c640fc627b' \
  --header 'content-type: application/json' \
  --data '{
    "type_col": 1,
    "start_date": "2023-04-04",
    "rate": 122,
    "employee_ids": [85422,98160],
    }'

```

### [](#Параметры-запроса "Параметры запроса")Параметры запроса

параметр

Тип

Описание

type\_col \*

integer

in range `1, 2, 3,4` 1 – часовая ставка 2 – еженедельная 3 – ежемесячная 4 – ежедневная

start\_date \*

date yyyy-mm-dd

Дата начала применения ставки

rate \*

number

Сумма создаваемой ставки

employee\_ids \*

integer\[\]

Массив сотрудников по employee\_id

### [](#Параметры-ответа-5 "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
  "items": [
        {
            "employee_id": 85422,
            "status": true,
            "id": 110530,
            "type_col": "1",
            "start_date": "2023-04-04",
            "end_date": "9999-12-31"
        },
        {
            "employee_id": 98160,
            "status": false,
            "errors": {
                "message": "The date of assigning salary should be later than the (\"2023-04-04\")",
                "code": 4001
            }
        },
    ]
}

```

Object| [salary Object](#Salary)

## [](#Добавление-правила-payroll "Добавление правила (payroll)")Добавление правила (payroll)

Добавление правила заработной платы для сотрудников

### [](#HTTP-Запрос-14 "HTTP Запрос")HTTP Запрос

`POST "https://api.workly.io/v1/payroll/add-payroll`

```
curl --request POST \
  --url https://api.workly.io/v1/add-payroll \
  --header 'authorization: Bearer b7208630a975c07725a724eccc4332c640fc627b' \
  --header 'content-type: application/json' \
  --data '{
    "payroll_rule_id": 53,
    "start_date": "2023-04-04",
    "person_ids": [85422,98160],
    }'

```

### [](#Параметры-запроса-1 "Параметры запроса")Параметры запроса

параметр

Тип

Описание

start\_date \*

date yyyy-mm-dd

Дата начала применения правила

payroll\_rule\_id \*

integer

ID правила для применения

person\_ids \*

integer\[\]

Массив сотрудников по employee\_id

### [](#Параметры-ответа-6 "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
  "items": [
        {
            "employee_id": 85422,
            "status": true,
            "id": 14371,
            "payroll_rule": "KORZINKA",
            "start_date": "2022-05-05",
            "end_date": "9999-12-31"
        },
        {
            "employee_id": 98160,
            "status": false,
            "errors": {
                "message": "The date of assigning payroll should be later than the (\"2022-05-05\")",
                "code": 4001
            }
        }
    ]
}

```

Object| [payroll Object](#Payroll)

## [](#Добавление-автоштрафа-fine "Добавление автоштрафа (fine)")Добавление автоштрафа (fine)

Добавление автоматического штарфа для сотрудников.

### [](#HTTP-Запрос-15 "HTTP Запрос")HTTP Запрос

`POST "https://api.workly.io/v1/payroll/add-fine`

```
curl --request POST \
  --url https://api.workly.io/v1/add-fine \
  --header 'authorization: Bearer b7208630a975c07725a724eccc4332c640fc627b' \
  --header 'content-type: application/json' \
  --data '{
    "fine_id": 20,
    "start_date": "2023-04-04",
    "person_ids": [85422,98160],
    }'

```

### [](#Параметры-запроса-2 "Параметры запроса")Параметры запроса

параметр

Тип

Описание

start\_date \*

date yyyy-mm-dd

Дата начала применения автоштрафа

fine\_id \*

integer

ID автоштрафа для применения

person\_ids \*

integer\[\]

Массив сотрудников по employee\_id

### [](#Параметры-ответа-7 "Параметры ответа")Параметры ответа

> Ответ от сервера:

```
{
  "items": [
        {
            "employee_id": 85422,
            "status": true,
            "id": 236,
            "fine": "Штрафы",
            "start_date": "2022-05-04",
            "end_date": "9999-12-31"
        },
        {
            "employee_id": 98160,
            "status": false,
            "errors": {
                "message": "this fine is already in use",
                "code": 4001
            }
        }
    ]
}

```

Object| [fine Object](#PersonFine)