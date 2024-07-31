# 摘要

C++中的explicit关键字功能介绍

在读一些开源代码的时候会见到explicit关键字，explicit的字面意思是清晰的、明确的、显性的。在C++语法中，他的作用就如他的意思那样，让类的构造函数被显示调用。如果不了解explicit，可能会造成意想不到的错误。

### 1. 没有explicit的情况

我们先举一个没有explicit例子。

```cpp
#include <iostream>
using namespace std;

class A
{
public:
    A(int i = 1) : m(i)
    {}

    int getMa()
    {
        return m;
    }
private:
    int m;
};

int main()
{
    A a;
    cout << "a.m before a=10: " << a.getMa() << endl;
    a = 2;
    cout << "a.m after  a=10: " << a.getMa() << endl;

    return 0;
}
```

这段程序的输出结果如下：

```text
a.m before a=10: 1
a.m after  a=10: 2
```

在上面的例子中，我们发现虽然我们没有重载'='运算符， 但是却可以用'='，即a=10，直接把int型变量赋值给类A的成员变量m。

实际上，a =2被隐式转换成了s = A temp(2)，所以才能直接赋值。

### 2. 有explicit的情况

```cpp
#include <iostream>
using namespace std;

class A
{
public:
    explicit A(int i = 1) : m(i)
    {}

    int getMa()
    {
        return m;
    }
private:
    int m;
};

int main()
{
    A a;
    cout << "a.m before a=10: " << a.getMa() << endl;
    a = 2;
    cout << "a.m after  a=10: " << a.getMa() << endl;

    return 0;
}
```

这段程序和上面的程序几乎一样，仅仅是在类A的构造函数前加了explicit关键字。

此时的程序是编译不通过的，报错如下：

```text
no match for ‘operator=’ (operand types are ‘A’ and ‘int’)
     a = 2;
```

错误原因是没有重载'='运算符，也就是说我们加了explicit关键字之后，a =2不会被隐式转换成s = A temp(2)。

### 3. 总结

explicit关键字的作用就是防止类构造函数的隐式自动转换。

explicit在下面两种情况下有效：

- 类的构造函数只有一个参数时；
- 类的构造函数中除了第一个参数以外，其他参数都有默认值的时候。(第一个参数可以有默认值，也可以没有)

google C++规范中也约定所有单参数的构造函数都必须是显示的，即使用explicit关键字。
