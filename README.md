STerm
-----

Watch SQL files and run them when updated


Installing
----------

```
sudo npm install -g sterm
```


Setting up
----------

Make a directory to store database connections (currently only supports postrgres)

```
module.exports = {
    postgres: {
        host: 'vm.vertebrae.io',
        //port: 5432,
        user: 'postgres',
        database: 'dev_bistatsingest'
    }
};
```

Running
-------

CD to your SQL directory and run `sterm`


***Sterm will glob for all SQL files in the current and sub-directories and attach watchers to them.***
