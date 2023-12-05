import express, { Express, Request, Response } from "express"
import { User, Deck, FlashcardAnswer, FlashcardTrueFalse } from "./types.js"
import dotenv from "dotenv"

dotenv.config()
const app: Express = express()
const port = process.env.PORT

app.use(express.json())

app.post("/users", (req: Request, res: Response) => {
  const userData: { login: string, password: string} = req.body
  res.send(users.find((user: User) => user.login == userData.login && user.password == userData.password))
})

app.get("/users/:id", (req: Request, res: Response) => {
  const userId: string = req.params.id;
  res.send(users.find((user: User) => user.id === parseInt(userId)))
})

const users: User[] = [
  {
    id: 1,
    login: "admin",
    password: "admin"
  },
  {
    id: 2,
    login: "user",
    password: "user"
  }
]
const decks: Deck[] = [
  {
    id: 1,
    name: "Angielski",
    flashcards: [
      new FlashcardAnswer(1, 'classroom', 'klasa'),
      new FlashcardTrueFalse(2, 'Is the sky blue?', true),
      new FlashcardAnswer(3, 'weather', 'pogoda'),
      new FlashcardTrueFalse(4, 'Are elephants able to fly?', false),
      new FlashcardAnswer(5, 'delicious', 'pyszny'),
    ],
    author: {
      id: 1,
      login: "admin",
      password: "admin"
    },
    isPublic: true
  },
  {
    id: 2,
    name: "Niemiecki",
    flashcards: [
      new FlashcardAnswer(1, 'Haus', 'Dom'),
      new FlashcardAnswer(2, 'Apfel', 'Jabłko'),
      new FlashcardAnswer(3, 'Auto', 'Samochód'),
      new FlashcardTrueFalse(4, 'Ist Berlin die Hauptstadt von Deutschland?', true),
      new FlashcardTrueFalse(5, 'Ist Wasser eine feste Substanz?', false)
    ],
    author: {
      id: 1,
      login: "admin",
      password: "admin"
    },
    isPublic: false
  },
  {
    id: 3,
    name: "Hiszpański",
    flashcards: [
      new FlashcardAnswer(1, 'Casa', 'Dom'),
      new FlashcardAnswer(2, 'Manzana', 'Jabłko'),
      new FlashcardAnswer(3, 'Coche', 'Samochód'),
      new FlashcardTrueFalse(1, 'Es Madrid la capital de España?', true),
      new FlashcardTrueFalse(2, 'El agua es una sustancia sólida?', false)
    ],
    author: {
      id: 2,
      login: "user",
      password: "user"
    },
    isPublic: false
  },
]

app.listen(port, () => console.log(`Server is listening on port ${port}`))