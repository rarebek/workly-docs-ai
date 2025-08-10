---
title: "Errors"
url: "https://dev.workly.io/#errors"
section_order: 16
scraped_at: "2025-08-10T13:45:11.960Z"
---

# [](#Errors "Errors")Errors

`API Workly использует следующие коды ошибок:`

Код ошибки

Описание

400

Bad Request – Ваш запрос неверен, возможно сервер обнаружил синтаксическую ошибку в запросе

401

Unauthorized – Вы не авторизованы или ваш ключ доступа неверен.

403

Forbidden – Доступ ограничен. Для получения доступа ваша роль в системе Workly должна быть - администратор.

404

Not Found – Указанный вами URL не найден.

405

Method Not Allowed – Указанный вами метод не может быть применен к Workly.

406

Not Acceptable – Запрошенный вами формат не является JSON.

422

Validation Failed – Входные данные не соответствуют требуемому формату или критериям.

426

Upgrade Required – Необходимо обнавить версию API.

429

Too Many Requests – Вы отправили слишком много запросов в течении 1 минуты.

500

Internal Server Error – Внутренняя ошибка сервера. Пожалуйста попробуйте еще раз.

503

Service Unavailable – Сервер временно недоступен. Мы временно отсутствуем для технических доработок.

```
{
    "message": "The access token provided is invalid",
    "code": 7008
}

{
    "message": "Неверное имя пользователя или пароль",
    "code": 7002
}
...

```

### [](#Ошибка-АПИ "Ошибка АПИ")Ошибка АПИ

Код ошибки

Описание

3000

NOT FOUND

4000

BAD REQUEST (В запросе отсутствуют аргументы)

4001

INVALID\_REQUEST (Неправильный запрос)

5000

Service error (Внутри системная ошибка)

6000

Too Many Requests (Слишком много запросов)

7001

AUTHORIZATION ERROR (Ошибка авторизации)

7002

AUTHORIZATION Login error (Авторизация: Неправильный логин или пароль)

7003

AUTHORIZATION INVALID CLIENT (Авторизация: Неправльный client\_id )

7004

AUTHORIZATION ACCESS DENIED (Авторизация: доступ запрещен)

7005

AUTHORIZATION GRANT TYPE (Авторизация: недействительный grant\_type)

7006

AUTHORIZATION REFRESH EXPIRED (Авторизация: обновите устаревший токен)

7007

AUTHORIZATION NOT AUTH (Вы отправили не авторизованный запрос)

7008

AUTHORIZATION INVALID TOKEN (Неправильный токен)

7009

AUTHORIZATION TOKEN EXPIRED (Токен недействителен)

7010

Необходимо обновить версию платформы.

7011

NOT Allowed DELETE - Невозможно удалить так как к этому объекту прикреплены сотрудники

7012

Employee Limit - лимит на количество сотрудников превышен

8001

VALIDATION ERROR - Ошибка валидации

```
{
    "message": "Validation Failed",
    "code": 8001,
    "errors": [
        {
            "field": "first_name",
            "code": 8002,
            "message": "Необходимо заполнить поле Имя"
        },
        {
            "field": "start_date",
            "code": 8010,
            "message": "Ошибка минимальное значение Дата начала работы"
        },
        {
            "field": "username",
            "code": 8008,
            "message": "Это E-mail уже занято"
        }
    ]
}

```

### [](#VALIDATION-ERROR "VALIDATION ERROR")VALIDATION ERROR

Код ошибка

Описание

8002

FIELD REQUIRED - Заполните необходимые поля

8003

Invalid value - Неверное значение

8004

Вы ввели не правильные значения

8005

FIELD PARAMS ACCESS DENIED

8006

INVALID ROLE - Неверная роль

8007

Invalid Email - Неправильный email

8008

ALREADY EXISTS - Уже существует

8009

DATE FORMAT ERROR - Неверный формат даты

8010

MIN DATE VALUE ERROR - Неверное значение минимальной даты

```
{
    "message": "Validation Failed",
    "code": 8001,
    "errors": {
        "field": "password",
        "code": 8002,
        "message": "Заполните поле - Пароль"
    }
}

```

### [](#Платформа "Платформа")Платформа

Способы обновления платформы  
Предусмотренно два типо обновлений:

-   Recommended (рекомендованный)
-   Require force update (принудительный)

В первом случае пользователь получает уведомление с рекомендацией обновить платформу. В ответ от сервера получаем в header **“Version”:”recommended”**

```
{
    "message": "Upgrade Required",
    "code": 7010
}

```

Во втором случае клиент получает статус “Require force update” API перестает отвечать и клиент получает от сервера ошибку 426 до тех пор пока не обновит платформу.

  
После каждого нового обновления необходимо обновить **client\_id** и **client\_secret**