export default function AuthPanel({
  registerForm,
  setRegisterForm,
  loginForm,
  setLoginForm,
  onRegister,
  onLogin,
}) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">Auth</h2>

      <form className="grid gap-2" onSubmit={onRegister}>
        <input
          className="rounded border p-2"
          placeholder="Name"
          value={registerForm.name}
          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Email"
          type="email"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Password (min 6)"
          type="password"
          value={registerForm.password}
          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
          required
        />
        <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">
          Register
        </button>
      </form>

      <form className="grid gap-2" onSubmit={onLogin}>
        <input
          className="rounded border p-2"
          placeholder="Email"
          type="email"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Password"
          type="password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          required
        />
        <button className="rounded bg-slate-700 px-3 py-2 text-white" type="submit">
          Login
        </button>
      </form>
    </section>
  );
}
