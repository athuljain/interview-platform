import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [form, setForm] =
        useState({
            email: "",
            password: ""
        });

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                const response =
                    await api.post(
                        "/auth/login",
                        form
                    );

                login(
                    response.data
                );

                const role =
                    response.data.user.role;

                if (role === "admin") {

                    navigate(
                        "/admin"
                    );

                } else if (
                    role === "faculty"
                ) {

                    navigate(
                        "/faculty"
                    );

                } else {

                    navigate(
                        "/intern"
                    );

                }

            } catch (error) {

                alert(
                    error.response
                        ?.data?.message ||
                    "Login failed"
                );

            }

        };

    return (

        <div>

            <h1>Login</h1>

            <form
                onSubmit={handleSubmit}
            >

                <input
                    type="email"
                    placeholder="Email"
                    value={
                        form.email
                    }
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email:
                                e.target.value
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={
                        form.password
                    }
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password:
                                e.target.value
                        })
                    }
                />

                <button>
                    Login
                </button>

            </form>
            <Link to={"/register"}>Register</Link>

        </div>

    );
}

export default Login;