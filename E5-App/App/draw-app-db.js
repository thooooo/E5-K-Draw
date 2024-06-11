import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://uwgcchivhnirzjamygqv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Z2NjaGl2aG5pcnpqYW15Z3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MjAyOTUsImV4cCI6MjAyMzk5NjI5NX0.Mte3RWleAt6UEADkwkOFJznwRZfsymx0Xbg748BZnZc"
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener("DOMContentLoaded", async function () {

    const { data } = await supabase
		.from('users_drawing')
		.select('drawing(title, descr, image_data, is_public), users(id, username, pp)')

	for (var i =0; i < data.length; i++) {
		if (data[i].users.id == localStorage.getItem("userId")) {
			document.getElementById("pp").src = data[i].users.pp;
		}
	}

    // Save drawing
    const saveBtn = document.getElementById("save");
    
    saveBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const titleData = document.getElementById("title").value;
        const descrData = document.getElementById("descr").value;
        const publicData = document.getElementById("ispublic").value;

        const imageData = document.getElementById("drawing").value;

        const { data, error } = await supabase
            .from('drawing')
            .insert({ crea_date: new Date().toISOString().slice(0, 10), title: titleData, descr: descrData, image_data: imageData, is_public: publicData })
            .select();

        if (error) {
            console.error("Couldn't insert in drawing");
        }

        const { error2 } = await supabase
            .from('users_drawing')
            .insert({ id_users: localStorage.getItem("userId"), id_drawing: data[0].id });

        if (error2) {
            console.error("Couldn't insert in users_drawing");
        }
    });
});