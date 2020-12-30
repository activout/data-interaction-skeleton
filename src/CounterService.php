<?php
declare(strict_types=1);

namespace App;


use PDO;
use PDOStatement;

class CounterService
{
    private PDO $pdo;

    /**
     * CounterService constructor.
     * @param PDO $pdo
     */
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->createDatabaseTable();
    }

    /**
     * @param string $query
     * @return bool|PDOStatement
     */
    private function prepare(string $query)
    {
        return $this->pdo->prepare($query);
    }

    public function getCounters(): array
    {
        $query = "select * from counters";
        $statement = $this->prepare($query);
        $statement->execute();

        $counters = array();
        while ($entry = $statement->fetchObject(CounterModel::class)) {
            $counters[] = $entry;
        }
        return $counters;
    }

    public function increaseCounter(int $id): ?CounterModel
    {
        $query = "update counters set value=value+1 where id=:id";
        $statement = $this->prepare($query);
        $statement->execute(compact('id'));

        return $this->getCounter($id);
    }

    public function getCounter(int $id): ?CounterModel
    {
        $query = "select * from counters where id=:id";
        $statement = $this->prepare($query);
        $statement->execute(compact('id'));
        return $statement->fetchObject(CounterModel::class) ?: null;
    }

    public function createCounter(string $name): CounterModel
    {
        $query = "insert into counters (name) values (:name);";
        $statement = $this->prepare($query);
        $statement->execute(compact('name'));

        $id = (int)$this->pdo->lastInsertId();
        return $this->getCounter($id);
    }

    public function createDatabaseTable(): void
    {
        $ddl = <<<EOF
create table IF NOT EXISTS counters
(
	id int auto_increment
		primary key,
	value int default 0 not null,
	name varchar(50) null
);
EOF;
        $this->pdo->exec($ddl);
    }
}