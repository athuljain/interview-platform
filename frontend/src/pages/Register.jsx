import { useState } from "react";
import api from "../services/api";

function Register() {

    const [form, setForm] =
        useState({

            name: "",

            email: "",

            password: "",

            department: ""

        });

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                const response =
                    await api.post(
                        "/auth/register",
                        form
                    );

                alert(
                    response.data.message
                );

            } catch (error) {

                alert(
                    error.response
                        ?.data?.message ||
                    "Registration failed"
                );

            }

        };

    return (

        <div>

            <h1>Intern Registration</h1>

            <form
                onSubmit={handleSubmit}
            >

                <input
                    placeholder="Name"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Email"
                    type="email"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Password"
                    type="password"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Department"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            department:
                                e.target.value
                        })
                    }
                />

                <button>
                    Register
                </button>

            </form>

        </div>

    );
}

export default Register;