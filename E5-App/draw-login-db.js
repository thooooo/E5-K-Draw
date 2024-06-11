import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://uwgcchivhnirzjamygqv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Z2NjaGl2aG5pcnpqYW15Z3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MjAyOTUsImV4cCI6MjAyMzk5NjI5NX0.Mte3RWleAt6UEADkwkOFJznwRZfsymx0Xbg748BZnZc"
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener("DOMContentLoaded", async function () {
    // SignUp
    const formSignUp = document.querySelector(".signup");

    formSignUp.addEventListener("submit", async function (event) {
        event.preventDefault();

        const usernameSignUp = document.getElementById("username-signup").value;
        const passwordSignup = document.getElementById("password-signup").value; 
        const emailSignUp = document.getElementById("email-signup").value; 

        const hashedPasswordSignUp = CryptoJS.SHA256(passwordSignup).toString(CryptoJS.enc.Hex);

        const { data, error } = await supabase.auth.signUp( {
                email: emailSignUp,
                password: hashedPasswordSignUp,
                options: {
                    data: {
                        username: usernameSignUp,
                    }
                }
            }
        )

        const { error2 } = await supabase
            .from('users')
            .insert({ id: data.user.id, username: usernameSignUp, password: hashedPasswordSignUp, email: emailSignUp })

        if (error || error2) {
            console.error("Couldn't insert in database");
        }
    });

    // Login
    const formLogin = document.querySelector(".login");

    formLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userLogin = document.getElementById("user-login").value;
        const passwordLogin= document.getElementById("password-login").value;

        const hashedPasswordLogin = CryptoJS.SHA256(passwordLogin).toString(CryptoJS.enc.Hex);

        const { data, error } = await supabase
            .from('users')
            .select('id, email, username, password')

        for (let i = 0; i < data.length; i++) {

            if ((data[i].email == userLogin || data[i].username == userLogin) && data[i].password == hashedPasswordLogin) {
                localStorage.setItem("userId", data[i].id);
                this.submit();
            }
            else {
                console.error("Invalid credentials");
            }
        }

        if (error) {
            console.error("Couldn't fetch in database");
        }
    });
});