// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  veryfyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',

    data: {
      users: { list, isEmpty: list.length === 0 },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-success-info', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-success-info', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.veryfyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('user-success-info', {
    style: 'user-success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================
// ================================================================
// ================================================================
// ================================================================
// ================================================================

// ================================================================

class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = new Date().toISOString()
  }
  static getList = () => this.#list

  checkId = (id) => this.id === id

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const product = this.getById(id)
    const { name, price, description } = data
    if (product) {
      if ((name, price, description)) {
        product.name = name
        product.price = price
        product.description = description
      }
      return true
    } else {
      return false
    }
  }
  static update = (name, { product }) => {
    if (name) {
      product.name = name
    }
  }
}

// ================================================================

router.get('/user-product-create', function (req, res) {
  const list = Product.getList()

  res.render('user-product-create', {
    style: 'user-product-create',
  })
})

// ================================================================

router.post('/user-product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('user-alert', {
    style: 'user-alert',
    info: 'Товар успішно був створений',
  })
})

// ================================================================

router.get('/user-product-list', function (req, res) {
  const list = Product.getList()

  console.log(list)

  res.render('user-product-list', {
    style: 'user-product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.get('/user-product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  console.log(product)
  if (product) {
    return res.render('user-product-edit', {
      style: 'user-product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('user-alert', {
      style: 'user-alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})

// ================================================================

router.post('/user-product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  console.log(id)
  console.log(product)

  if (product) {
    res.render('user-alert', {
      style: 'user-alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    res.render('user-alert', {
      style: 'user-alert',
      info: 'Сталася помилка',
    })
  }
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const product = Product.deleteById(Number(id))

  if (product) {
    res.render('user-alert', {
      style: 'user-alert',
      info: 'Товар видалений',
    })
  } else {
    res.render('user-alert', {
      style: 'user-alert',
      info: 'Сталася помилка',
    })
  }
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
