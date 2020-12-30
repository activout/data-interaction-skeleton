<?php
declare(strict_types=1);

namespace App;


class CounterModel
{
    public int $id;
    public int $value;
    public ?string $name;
}