---
title: "Accounts"
url: "https://dev.workly.io/#accounts"
section_order: 2
scraped_at: "2025-08-10T13:45:11.935Z"
---

# [](#Accounts "Accounts")Accounts

Здесь содержится информация о пользователе системы Workly, на email которого был получен access\_token и была совершена аутентификация.

## [](#Профиль-пользователя "Профиль пользователя")Профиль пользователя

```
curl --request GET \
  --url https://api.workly.io/v1/accounts \
  --header 'authorization: Bearer e19e755612bfe1eb44f64c6367beb00567ba6c76' \

```

Позволяет получить текущую информацию пользователя из профиля сотрудника, графика работы,время прихода/ухода и отработанное время.

**параметры ответа:**

> Ответ от сервера:

```
{
    "id": 1687,
    "user_name": "useremail@gmail.com",
    "company_id": 75,
    "company_name": "NEWMAX",
    "role": {
        "id": 1,
        "name": "Администратор"
    },
    "employee": {
        "id": 20502,
        "last_name": "Беляев",
        "first_name": "Антон",
        "patronymic": "",
        "full_name": "Антон Беляев",
        "gender": "male",
        "photos": {
            "small": "https://app.workly.io/images/employee/40/75/20502.png",
            "medium": "https://app.workly.io/images/employee/120/75/20502.png"
        },
        "start_date": "2014-08-12",
        "pin_code": "147",
        "tab_number": "144",
        "birth_date": "1991-05-31",
        "home_address": "",
        "home_phone": "",
        "work_phone": "",
        "notes": null,
        "mobile_phone": "+xxxxxxxxxxxx",
        "user": {
            "id": 139,
            "email": "useremail@gmail.com"
        },
        "department": {
            "id": 582,
            "title": "Отдел разработки и программирования"
        },
        "position": [
            {
                "id": "1043",
                "title": "Программист"
            }
        ],
        "schedule": {
            "id": 9627,
            "title": "Отдел Программирования 9.30-18.30",
            "type": 2
        },
        "locations": [
            {
                "id": 368,
                "title": "NewMax"
            },
            {
                "id": 846,
                "title": "Workly office"
            }
        ],
        "lastEmployeeSalaryRate": {
            "id": 110312,
            "rate": "1000.00",
            "start_date": "2022-02-22",
            "type": 1
        },
        "lastPersonPayroll": {
            "id": 14237,
            "payroll_rule_id": 47,
            "start_date": "2021-02-01",
            "payrollRule": {
                "title": "Ежедневный",
                "otc_algorithm_daily": "1"
            }
        },
        "lastPersonFine": {
            "id": 143,
            "fine_id": 20,
            "start_date": "2021-02-01",
            "fine": {
                "title": "Штрафы",
                "has_dayly_fine,": 1,
                "amount,": "0.00"
            }
        },
    },
    "scheduled": {
        "report_date": "2017-09-22",
        "is_work_day": true,
        "production_time": "08:00",
        "start_time": "2017-09-22 09:30:00",
        "end_time": "2017-09-22 18:30:00",
        "schedule_id": null,
        "timeoff_id": null
    },
    "actual": {
        "first_in": "15:47",
        "last_out": null,
        "late_in": "06:17",
        "early_in": null,
        "early_out": null,
        "authorized_time": "00:00",
        "work_time": "00:00"
    },
    "settings": {
        "id": 140,
        "user_id": 139,
        "fiotype": "firstlastmiddle",
        "date_format": "full",
        "time_zone": "Asia/Tashkent",
        "ampm": "24",
        "lang": "ru"
    }
}

```

параметр

Тип

Описание

id

integer

id пользователя в системе

user\_name

string

логин пользователя(email)

company\_id

integer

id компании

company\_name

string

название компании

role

Object

[роль сотрудника в системе](#AccountRole)

employee

Object

[Employee Object](#Employee)

scheduled

Object

[TimesScheduled Object](#TimesScheduled) текущая информация о графике сотрудника

actual

Object

[TimesActual Object](#TimesActual) текущая информация о приходах и уходах сотрудника

settings

Object

[UserSettings Object](#UserSettings) текущая информация о приходах и уходах сотрудника

### [](#HTTP-Запрос "HTTP Запрос")HTTP Запрос

`POST "https://api.workly.io/v1/accounts"`