import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function useAuth() {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem('user')
		return saved ? JSON.parse(saved) : null
	})

	const login = async (email, password) => {
		const { data } = await axios.post('/api/users/login', { email, password })
		localStorage.setItem('user', JSON.stringify(data))
		setUser(data)
	}
	const register = async (name, email, password) => {
		const { data } = await axios.post('/api/users', { name, email, password })
		localStorage.setItem('user', JSON.stringify(data))
		setUser(data)
	}
	const logout = () => {
		localStorage.removeItem('user')
		setUser(null)
	}
	return { user, login, register, logout }
}

function Navbar({ user, onLogout }) {
	return (
		<nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
			<Link to="/">Home</Link>
			<Link to="/books">Books</Link>
			<Link to="/categories">Categories</Link>
			<Link to="/authors">Authors</Link>
			{user ? (
				<>
					<Link to="/profile">Profile</Link>
					<Link to="/orders">My Orders</Link>
					<button onClick={onLogout}>Logout</button>
				</>
			) : (
				<>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
				</>
			)}
		</nav>
	)
}

function Home() {
	return <div style={{ padding: 16 }}>Welcome to the Bookstore</div>
}

function Books() {
	const [items, setItems] = useState([])
	useEffect(() => {
		axios.get('/api/books').then((res) => setItems(res.data))
	}, [])
	return (
		<div style={{ padding: 16 }}>
			<h2>Books</h2>
			<ul>
				{items.map((b) => (
					<li key={b.id}>
						<Link to={`/books/${b.id}`}>{b.title}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

function BookDetail() {
	const [book, setBook] = useState(null)
	const id = location.pathname.split('/').pop()
	useEffect(() => {
		axios.get(`/api/books/${id}`).then((res) => setBook(res.data))
	}, [id])
	if (!book) return <div style={{ padding: 16 }}>Loading...</div>
	return (
		<div style={{ padding: 16 }}>
			<h2>{book.title}</h2>
			<div>Price: ${book.price}</div>
			<div>In Stock: {book.countInStock}</div>
			<h3>Reviews</h3>
			<ul>
				{(book.reviews || []).map((r, idx) => (
					<li key={idx}>{r.name}: {r.rating} - {r.comment}</li>
				))}
			</ul>
		</div>
	)
}

function Categories() {
	const [items, setItems] = useState([])
	useEffect(() => {
		axios.get('/api/categories').then((res) => setItems(res.data))
	}, [])
	return (
		<div style={{ padding: 16 }}>
			<h2>Categories</h2>
			<ul>
				{items.map((c) => (
					<li key={c.id}>
						<Link to={`/categories/${c.id}`}>{c.name}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

function CategoryBooks() {
	const [items, setItems] = useState([])
	const id = location.pathname.split('/').pop()
	useEffect(() => {
		axios.get(`/api/categories/${id}/books`).then((res) => setItems(res.data))
	}, [id])
	return (
		<div style={{ padding: 16 }}>
			<h2>Books</h2>
			<ul>
				{items.map((b) => (
					<li key={b.id}>
						<Link to={`/books/${b.id}`}>{b.title}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

function Authors() {
	const [items, setItems] = useState([])
	useEffect(() => {
		axios.get('/api/authors').then((res) => setItems(res.data))
	}, [])
	return (
		<div style={{ padding: 16 }}>
			<h2>Authors</h2>
			<ul>
				{items.map((a) => (
					<li key={a.id}>
						<Link to={`/authors/${a.id}`}>{a.name}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

function AuthorBooks() {
	const [items, setItems] = useState([])
	const id = location.pathname.split('/').pop()
	useEffect(() => {
		axios.get(`/api/authors/${id}/books`).then((res) => setItems(res.data))
	}, [id])
	return (
		<div style={{ padding: 16 }}>
			<h2>Books</h2>
			<ul>
				{items.map((b) => (
					<li key={b.id}>
						<Link to={`/books/${b.id}`}>{b.title}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

function Login({ onLogin }) {
	const [email, setEmail] = useState('admin@example.com')
	const [password, setPassword] = useState('admin123')
	return (
		<div style={{ padding: 16 }}>
			<h2>Login</h2>
			<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<button onClick={() => onLogin(email, password)}>Login</button>
		</div>
	)
}

function Register({ onRegister }) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	return (
		<div style={{ padding: 16 }}>
			<h2>Register</h2>
			<input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
			<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<button onClick={() => onRegister(name, email, password)}>Register</button>
		</div>
	)
}

function Profile({ user, setUser }) {
	const [name, setName] = useState(user?.name || '')
	const [email, setEmail] = useState(user?.email || '')
	const save = async () => {
		const { data } = await axios.put('/api/users/profile', { name, email }, { headers: { Authorization: `Bearer ${user.token}` } })
		localStorage.setItem('user', JSON.stringify(data))
		setUser(data)
	}
	return (
		<div style={{ padding: 16 }}>
			<h2>Profile</h2>
			<input value={name} onChange={(e) => setName(e.target.value)} />
			<input value={email} onChange={(e) => setEmail(e.target.value)} />
			<button onClick={save}>Save</button>
		</div>
	)
}

function MyOrders({ user }) {
	const [items, setItems] = useState([])
	useEffect(() => {
		axios.get('/api/orders/myorders', { headers: { Authorization: `Bearer ${user.token}` } }).then((res) => setItems(res.data))
	}, [user])
	return (
		<div style={{ padding: 16 }}>
			<h2>My Orders</h2>
			<ul>
				{items.map((o) => (
					<li key={o.id}>Order {o.id} - ${o.totalPrice.toFixed(2)}</li>
				))}
			</ul>
		</div>
	)
}

function RequireAuth({ user, children }) {
	if (!user) return <Navigate to="/login" />
	return children
}

export default function App() {
	const { user, login, register, logout } = useAuth()
	const [currentUser, setCurrentUser] = useState(user)
	useEffect(() => setCurrentUser(user), [user])
	return (
		<div>
			<Navbar user={currentUser} onLogout={logout} />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/books" element={<Books />} />
				<Route path="/books/:id" element={<BookDetail />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/categories/:id" element={<CategoryBooks />} />
				<Route path="/authors" element={<Authors />} />
				<Route path="/authors/:id" element={<AuthorBooks />} />
				<Route path="/login" element={<Login onLogin={login} />} />
				<Route path="/register" element={<Register onRegister={register} />} />
				<Route path="/profile" element={<RequireAuth user={currentUser}><Profile user={currentUser} setUser={setCurrentUser} /></RequireAuth>} />
				<Route path="/orders" element={<RequireAuth user={currentUser}><MyOrders user={currentUser} /></RequireAuth>} />
			</Routes>
		</div>
	)
}
