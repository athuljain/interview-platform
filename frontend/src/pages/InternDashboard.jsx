import { useEffect, useState } from "react";
import api from "../services/api";

function InternDashboard() {

    const [courses, setCourses] =
        useState([]);

    useEffect(() => {

        const getCourses =
            async () => {

                const response =
                    await api.get(
                        "/courses"
                    );

                setCourses(
                    response.data
                );

            };

        getCourses();

    }, []);

    return (

        <div>

            <h1>
                Intern Dashboard
            </h1>

            <h2>
                Select Your Course
            </h2>

            <div>

                {courses.map(
                    (course) => (

                        <div
                            key={course._id}
                        >

                            <h3>
                                {course.name}
                            </h3>

                            <p>
                                {
                                    course.description
                                }
                            </p>

                            <button>
                                Start
                            </button>

                        </div>

                    )
                )}

            </div>

        </div>

    );
}

export default InternDashboard;