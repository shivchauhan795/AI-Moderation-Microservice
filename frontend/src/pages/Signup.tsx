import { useRef } from "react";
import { validateSignup } from "../utils/validator"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Signup = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    async function handleSignup(e: any) {
        e.preventDefault();
        try {

            const validation = validateSignup.safeParse({
                name: nameRef.current?.value,
                email: emailRef.current?.value,
                password: passwordRef.current?.value
            });

            if (!validation.success) {
                toast.error("Data is not valid!");
                return;
            }
            else {
                const response = await fetch(`${backendUrl}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: emailRef.current?.value,
                        password: passwordRef.current?.value,
                        name: nameRef.current?.value
                    })
                });

                if (!response.ok) {
                    toast.error("Invalid Signup response from the server");
                    return;
                }

                const data = await response.json();


                emailRef.current!.value = "";
                passwordRef.current!.value = "";
                nameRef.current!.value = "";

                toast.success(data.message);

                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (e) {
            toast.error("Error in Signup. Try again!!");
            console.log(e);
        }

    }
    return (
        <div className="flex h-screen justify-center items-center bg-slate-100">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="border shadow-2xl w-96 h-96 rounded-2xl flex flex-col justify-center items-center bg-white">
                <h1 className="flex justify-center font-bold text-2xl uppercase p-2">Signup</h1>
                <form onSubmit={(e) => handleSignup(e)} className="flex flex-col justify-center items-center gap-5 p-5 w-3/4">
                    <input ref={nameRef} type="text" placeholder="Name" className="w-full mx-16 border rounded-lg p-2" />
                    <input ref={emailRef} type="email" placeholder="Email" className="w-full mx-16 border rounded-lg p-2" />
                    <input ref={passwordRef} type="password" placeholder="Password" className="w-full mx-16 border rounded-lg p-2" />
                    <button type="submit" className="border py-1 px-3 rounded-md cursor-pointer bg-green-300">Signup</button>
                </form>
                <div className="flex gap-3 items-center justify-center">
                    <h4>Already have an account?</h4>
                    <Link to="/login" className="font-semibold underline cursor-pointer">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup
