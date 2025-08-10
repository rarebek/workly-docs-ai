---
title: "Objects"
url: "https://dev.workly.io/#objects"
section_order: 15
scraped_at: "2025-08-10T13:45:11.960Z"
---

# [](#Objects "Objects")Objects

## [](#Employee "Employee")Employee

```
{
        "id": 20502,
        "last_name": "Беляев",
        "first_name": "Антон",
        "patronymic": "",
        "full_name": "Антон Беляев",
        "gender": "male",
        "photos": {
            "small": "https://app.workly.io/images/employee/40/75/21393.png",
            "medium": "https://app.workly.io/images/employee/120/75/21393.png"
        },
        "start_date": "2014-08-12",
        "schedule_start_date": "2019-05-16",
        "pin_code": "147",
        "tab_number": "144",
        "birth_date": "1991-05-31",
        "home_address": "",
        "home_phone": "",
        "work_phone": "",
        "note": null,
        "mobile_phone": "+xxxxxxxxxxxx",
        "qrcode": "3367538278",
        "user": {
            "id": 1790,
            "email": "example@workly.io"
        },
        "department": {
            "id": 582,
            "title": "Отдел разработки и программирования"
        },
        "positions":  [
            {
                "id": 3938,
                "title": "Техническая поддержка BioTrack"
            },
            {
                "id": 4264,
                "title": "контент менеджер"
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

```

параметр

Тип

Описание

id

integer

id сотрудника

last\_name

string

фамилия сотрудника

first\_name

string

имя сотрудника

patronymic

string

отчество сотрудника

full\_name

string

фио сотрудника

gender

string

пол сотрудника

birth\_date

string

день рождения сотрудника

home\_address

string

адрес проживания сотрудника

home\_phone

string

домашний телефон сотрудника

work\_phone

string

рабочий телефон сотрудника

mobile\_phone

string

мобильный телефон сотрудника

note

string

раздел “примечание” в профиле сотрудника

photos

Object

тип фотографии сотрудника `small, medium`

start\_date

string

дата начала работы сотрудника

pin\_code

string

pin код сотрудника

tab\_number

string

табельный номер сотрудника

qrcode

string

Hash для QR код сотрудника

user

Object

[Employee User](#Employee-User) текущая информация о пользователя

department

Object

[Employee Department](#Employee-Department) текущая информация об отделе сотрудника

positions

Object

[Employee Positions](#Employee-Positions) текущая информация о должности сотрудника

schedule

Object

[Employee Schedule](#Employee-Schedule) текущая информация о графике сотрудника

locations

Object

[Employee Locations](#Employee-Locations) текущая информация о локации сотрудника

schedule\_start\_date

string

Дата назначения графика

lastEmployeeSalaryRate

array

[последняя ставка заработной платы сотрудника](#Salary-Заработная-ставка)

lastPersonPayroll

array

[последнее правило заработной платы сотрудника](#Payroll-Правило-заработной-платы)

lastPersonFine

array

[последний автоштраф сотрудника](#PersonFine)

## [](#Employee-Department "Employee Department")Employee Department

```
{
    "id": 582,
    "title": "Отдел разработки и программирования"        
},

```

параметр

Тип

Описание

id

integer

id отдела

title

string

название отдела

## [](#Employee-User "Employee User")Employee User

```
{
    "id": 582,
    "email": "example@workly.io"        
},

```

параметр

Тип

Описание

id

integer

id пользователя

email

string

емайл пользователя

## [](#Employee-Positions "Employee Positions")Employee Positions

```
[
    {
        "id": "1043",
        "title": "Программист"
    }
]

```

параметр

Тип

Описание

id

integer

id должности

title

string

название должности

## [](#Employee-Schedule "Employee Schedule")Employee Schedule

```
{
    "id": 9627,
    "title": "Отдел Программирования 9.30-18.30",
    "type": 2
},

```

параметр

Тип

Описание

id

integer

id графика

title

string

название графика

type

integer

тип графика (1-4)

## [](#Employee-Locations "Employee Locations")Employee Locations

```
[
    {
        "id": 139,
        "title": "NewMax"
    },
    {
        "id": 846,
        "title": "Workly office"
    }
]

```

параметр

Тип

Описание

id

integer

id Локация

title

string

название локации

## [](#Department "Department")Department

```
{
            "id": 1994,
            "title": "MyTaxi",
            "count_employees": 9,
            "pid":null,
            "childs": [
                {
                    "id": 4050,
                    "title": "Операционный отдел",
                    "pid": 1994,
                    "count_employees": "9"
                },
                {
                    "id": 4051,
                    "title": "Программисты",
                    "pid": 1994,
                    "count_employees": 0
                }
            ]
        },

```

параметр

Тип

Описание

id

integer

id отдела

title

string

название отдела

pid

integer

главный отдел id

childs

object

информация о дочернем отделе, прикрепленному к главному отделу

## [](#Location "Location")Location

```
{
    "id": 846,
    "title": "asas",
    "lat": "41.293755399999995",
    "lon": "69.2459725",
    "radius": 300,
    "address": "ул. Хамзы Умарова, Ташкент, Узбекистан",
    "count_employees": 3,
    "count_devices": 0
}

```

параметр

Тип

Описание

id

integer

id локации

title

string

название графика

lat

string

широта расположения локации

lon

string

долгота расположения локации

radius

integer

радиус локации

address

string

адрес локации

count\_employees

integer

количество сотрудников, прикрепленных к локации

count\_devices

integer

количество устройств прикрепленных к локации

## [](#Position "Position")Position

```
{
    "id": "1047",
    "title": "HR-менеджер",
    "count_employees": 1
},

```

параметр

Тип

Описание

id

integer

id должности

title

string

Название должности

count\_employees

integer

число сотрудников, прикрепленных к должности

## [](#Schedule "Schedule")Schedule

```
{
    "id": 9204,
    "title": "Cвободный график для отдела программирования",
    "type": 1
}

```

параметр

Тип

Описание

id

integer

id графика

title

string

название графика

type

integer

тип графика …

## [](#personSalaries-закрепленные-ставки "personSalaries - закрепленные ставки")personSalaries - закрепленные ставки

```
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
}


```

параметр

Тип

Описание

department\_id

integer

ID отдела

employee\_id

integer

ID сотрудника

last\_name

string

Фамилия сотрудника

first\_name

string

Имя сотрудника

patronymic

string

Отчество сотрудника

photos

object

Фотография сотрудника

employeeSalaries

array

[Массив ставок сотрудника](#Salary-Заработная-ставка)

## [](#Salary-Заработная-ставка "Salary - Заработная ставка")Salary - Заработная ставка

```
{
    "id": 108660,
    "rate": "1000.00",
    "start_date": "2020-09-01",
    "end_date": "2020-09-03",
    "type_col": 1
}

```

параметр

Тип

Описание

id

integer

ID записи ставки

rate

number

Сумма ставки

start\_date

date yyyy-mm-dd

Дата начала ставки

end\_date

date yyyy-mm-dd

Дата окончания ставки

type\_col

int

in range `1, 2, 3, 4` 1 – часовая ставка 2 – еженедельная 3 – жемесячная 4 – ежедневная

## [](#personPayrolls-–-закрепленные-правила "personPayrolls – закрепленные правила")personPayrolls – закрепленные правила

```
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
        }
        ...
    ]
}


```

параметр

Тип

Описание

department\_id

integer

ID отдела

employee\_id

integer

ID сотрудника

last\_name

string

Фамилия сотрудника

first\_name

string

Имя сотрудника

patronymic

string

Отчество сотрудника

photos

object

Фотография сотрудника

personPayrolls

array

[Массив правил сотрудника](#Payroll-Правило-заработной-платы)

## [](#Payroll-Правило-заработной-платы "Payroll - Правило заработной платы")Payroll - Правило заработной платы

```
{
    "id": 14327,
    "start_date": "2023-02-01",
    "end_date": "9999-12-31",
    "payrollRule": {
        "id": 60,
        "title": "Test",
        "otc_algorithm_daily": true
    }
}

```

параметр

Тип

Описание

id

integer

Payroll - Правило заработной платы

start\_date

date yyyy-mm-dd

Дата начала правила

end\_date

date yyyy-mm-dd

Дата окончания правила

payrollRule

array

[Массив правил](#payrollRule)

## [](#payrollRule "payrollRule")payrollRule

```
{
    "id": 60,
    "title": "Test",
    "otc_algorithm_daily": true
}

```

параметр

Тип

Описание

id

integer

ID правила

title

string

Название правила

otc\_algorithm\_daily

boolean

Тип правила, ежедневный ежемесячный или

## [](#personFines "personFines")personFines

```
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
}


```

параметр

Тип

Описание

department\_id

integer

ID отдела

employee\_id

integer

ID сотрудника

last\_name

string

Фамилия сотрудника

first\_name

string

Имя сотрудника

patronymic

string

Отчество сотрудника

photos

object

Фотография сотрудника

personFines

array

[Массив автоштрафов сотрудника](#PersonFine)

## [](#PersonFine "PersonFine")PersonFine

```
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
}

```

параметр

Тип

Описание

id

integer

ID записи автоштрафа

start\_date

date yyyy-mm-dd

Дата начала автоштрафа

end\_date

date yyyy-mm-dd

Дата окончания автоштрафа

fine

array

[Массив автоштрафов](#Fine)

## [](#Fine "Fine")Fine

```
{
    "id": 20,
    "title": "Штрафы",
    "has_dayly_fine": 1,
    "amount": "0.00"
}

```

параметр

Тип

Описание

id

integer

ID автоштрафа

title

string

Название автоштрафа

has\_dayly\_fine

boolean

Автоштраф за отсутствие

amount

number

Стоимость автоштрафа

## [](#TimeOffType "TimeOffType")TimeOffType

```
{
    "id": 547,
    "title": "почас тест",
    "description": "",
    "color": "#f4f4f4"
}

```

параметр

Тип

Описание

id

integer

id типа отгула

title

string

название типа отгула

description

string

Описание

color

string

Цвет

## [](#TimeEmployee "TimeEmployee")TimeEmployee

```
{
    "id": 6294,
    "employee_id": 40599,
    "start_date_time": "2017-09-01 00:00:00",
    "end_date_time": "2017-09-02 23:59:59",
    "description": null,
    "status": 0,
    "paid": true,
    "absence_type": "daily",
    "absence": {
        "id": 547,
        "title": "почас тест",
        "description": "",
        "color": "#f4f4f4"
    },
    "created_at": "2017-09-14 09:39:34"
}

```

параметр

Тип

Описание

id

integer

id отгула

start\_date\_time

string

время начала отгула

end\_date\_time

string

время окончания отгула

description

string

описание

status

string

статус отгула (в ожидании - 0, Принятый - 1, Непринятый - 2, Удаленный - 3)

paid

boolean

принимает значение true и false (true - оплачиваемый, false - неоплачиваемый)

absence\_type

string

вид отгула (часовой и дневной)

created\_at

string

время и дата создания отгула

absence

object

[TimeOffType Object](#TimeOffType)

## [](#TimesScheduled "TimesScheduled")TimesScheduled

```
{
    "report_date": "2016-05-03",
    "is_work_day": false,
    "production_time": "12:00",
    "start_time": "2016-05-03 21:00:00",
    "end_time": "2016-05-04 09:00:00",
    "schedule_id": 9891,
    "timeoff_id": null
}

```

параметр

Тип

Описание

report\_date

string

число за которое нужно сгенерировать отчет

is\_work\_day

integer

принимает значения 1 или 0. 1 - рабочий день. 0 - выходной

production\_time

string

количество рабочих часов, установленных графиком

start\_time

string

время начала работы по графику

end\_time

string

время окончания работы по графику

timeoff\_id

string

id отгула

schedule\_id

string

id графика

## [](#TimesActual "TimesActual")TimesActual

```
{
    "first_in": "09:11",
    "last_out": null,
    "late_in": "12:11",
    "early_in": null,
    "early_out": null,
    "late_out": null,
    "authorized_time": "00:00",
    "work_time": "00:00",
    "last_event": "in"
}

```

параметр

Тип

Описание

authorized\_time

string

количество часов отработанных по графику

work\_time

string

количество часов отработанных в течении рабочего дня

first\_in

string

время первого прихода

last\_out

string

время последнего ухода

late\_in

string

количество часов опоздания

early\_in

string

количество часов раннего прихода

early\_out

string

количество часов ухода раньше окончания рабочего графика,

late\_out

string

количество часов раннего ухода,

last\_event

string

последнее событие `range["in", "out"]`

## [](#ReportEmployeeInfo "ReportEmployeeInfo")ReportEmployeeInfo

```
{
    "id": 35961,
    "full_name": "Аляви Саидаминхон Нозимхон угли",
    "first_name": "Аляви Саидаминхон",
    "last_name": "Нозимхон угли",
    "department_id": 7697,
    "department_title": "Отдел по умолчанию",
    "position_id": 1969603167,
    "position_title": "Должность без ставки",
    "photos": {
        "small": "http://app.workly.io/images/employee/40/75/40232.png",
        "medium": "http://app.workly.io/images/employee/120/75/40232.png"
    }
},

```

параметр

Тип

Описание

id

interger

ID сотрудников

full\_name

string

Имя сотрудников

last\_name

string

фамилия сотрудника

first\_name

string

имя сотрудника

department\_id

integer

ID отдела

department\_title

integer

название отдела

position\_id

integer

ID должности

position\_title

integer

название должности

photos

object

тип фото

## [](#UserSettings "UserSettings")UserSettings

```
{
        "id": 140,
        "fiotype": "firstlastmiddle",
        "date_format": "full",
        "time_zone": "Asia/Tashkent",
        "ampm": "24",
        "lang": "ru"
}

```

параметр

Тип

Описание

id

integer

id настройки

fiotype

string

отображение Ф.И.О. типа.  
`firstlastmiddle` - Иван Павлов Петрович;  
`firstlast` - Иван Павлов;  
`firstl` - Иван П;  
`firstmiddle` - Иван Петрович;  
`lastfirst` - Павлов Иван;  
`lastfirstmiddle` - Павлов Иван Петрович;  
`lastf` - Павлов И;  
`lastfm` - Павлов И П;

date\_format

string

формат даты.  
`range[full, long, medium, short]`.  
  
Если `lang`\=>`en`:  
`full => EEEE, MMMM d, y`;  
`long => MMMM d, y`;  
`medium => MMM d, y`;  
`short => M/d/yy`;  
  
Если `lang`\=>`ru`:  
`full => EEEE, d MMMM y 'г'.`;  
`long => d MMMM y 'г'.`;  
`medium => dd.MM.yyyy`;  
`short => dd.MM.yy`;

time\_zone

string

часовой пояс пользователя

ampm

string

формат времени пользователя  
Принимает: `24, ampm`

lang

string

язык пользователя  
`ru - Русский, en - English`

## [](#AccountRole "AccountRole")AccountRole

```
{
    "id": 1,
    "name": "Администратор"
},

```

параметр

Тип

Описание

id

integer

id рол

-   `1. Администратор`
-   `2. Руководитель отдела`
-   `3. Менеджер отдела`
-   `4. Наблюдатель`
-   `5. Сотрудник`

name

string

Названия ролей

## [](#DeviceInfo "DeviceInfo")DeviceInfo

```
{
    "id": 2632,
    "serial_number": "F00305A7-460D-4E79-8714-DE446B23CB09",
    "last_request_time": "2019-08-01 12:21:11",
    "time_zone": "Asia/Tashkent",
    "battery_level": null,
    "os_type": "ios",
    "os_version": "1.1.1",
    "app_version": "2.2.2",
    "logged_user_name": "ozodbekulmasov@gmail.com",
    "additional_button": false,
    "save_image_gallery": true,
    "front_camera": true,
    "photo_audit": true,
    "qr_code": true,
    "location_name": "Newmax",
    "type": "Terminal"
}

```

параметр

Тип

Описание

id

interger

ID устройства

serial\_number

string

Серийный номер устройства

last\_request\_time

datetime

Последнее соединение

time\_zone

string

Часовой пояс

battery\_level

integer

уровень заряда батареи

os\_type

string

тип ОС устройства

os\_version

string

версия ОС устройства

app\_version

string

версия приложения

logged\_user\_name

string

имя пользователя

additional\_button

boolean

true - включенный, false - выключено

save\_image\_gallery

boolean

true - включенный, false - выключено

front\_camera

boolean

статус фронтальной камеры

photo\_audit

boolean

true - включенный, false - выключено

qr\_code

boolean

true - включенный, false - выключено

location\_name

string

Локация

type

string

тип устройства