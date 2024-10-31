## Инструкция по работе с pm2

### Список команд для установки.

-   Зайти на сервер (_сервер, а не папку с проектом_) и установить pm2 как глобальный модуль

```
sudo npm install pm2 -g
```

---

### Список команд для управления.

-   Запустить pm2 (делается, как и все команды управления далее, _**в** папке с проектом_)

```
pm2 start index.js

// index.js - имя нашего запускаемого файла
```

-   Перезагрузить pm2

```
pm2 restart index.js

// после обновления (git pull) нужно обязательно перезапускать сервер.
// index.js - название исполнительного (главного) файла на сервере
```

-   Отключить pm2 и все смежные процессы

```
pm2 kill

// полностью отключает текущий pm2 и все запущенные приложения
```

-   Включить автоперезапуск сервера и pm2

```
 pm2 startup
```

-   Переименовать имя процесса (сервера, но это неккоректное сравнение)

```
 pm2 restart *id* --name *newName*

 // Пример: pm2 restart 1 --name development, где
 // *id* - идентификатор запущенного процесса 1
 // *newName* - новое имя процесса
```

-   Применить внесённые изменения

```
 pm2 save

 // если что-то поменяешь и не сохранишь - изменения пропадут
```

---

-   Ссылка на документацию

[PM2 documentation](https://pm2.io/docs/plus/quick-start// 'Официальная документация по PM2')
