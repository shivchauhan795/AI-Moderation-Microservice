import { useRef } from "react";
import { validateLogin } from "../utils/validator"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Login = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    async function handleLogin(e: any) {
        e.preventDefault();
        try {

            const validation = validateLogin.safeParse({
                email: emailRef.current?.value,
                password: passwordRef.current?.value
            });

            if (!validation.success) {
                toast.error("Data is not valid!");
                return;
            }
            else {
                const response = await fetch(`${backendUrl}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: emailRef.current?.value,
                        password: passwordRef.current?.value
                    })
                });

                if (!response.ok) {
                    toast.error("Invalid Login response from the server");
                    return;
                }

                const data = await response.json();

                localStorage.setItem("moderator_token", data.token);    // storing token in localstorage

                emailRef.current!.value = "";
                passwordRef.current!.value = "";

                toast.success(data.message);

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (e) {
            toast.error("Error in login. Try again!!");
            console.log(e);
        }

    }
    return (
        <div className="flex h-screen justify-center items-center bg-slate-100">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="border shadow-2xl w-96 h-72 rounded-2xl flex flex-col justify-center items-center bg-white">
                <h1 className="flex justify-center font-bold text-2xl uppercase p-2">Login</h1>
                <form onSubmit={(e) => handleLogin(e)} className="flex flex-col justify-center items-center gap-5 p-5 w-3/4">
                    <input ref={emailRef} type="email" placeholder="Email" className="w-full mx-16 border rounded-lg p-2" />
                    <input ref={passwordRef} type="password" placeholder="Password" className="w-full mx-16 border rounded-lg p-2" />
                    <button type="submit" className="border py-1 px-3 rounded-md cursor-pointer">Login</button>
                </form>
                <div className="flex gap-3 items-center justify-center">
                    <h4>Don't have an account?</h4>
                    <Link to="/signup" className="font-semibold underline cursor-pointer">Signup</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
