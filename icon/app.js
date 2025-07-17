async function addUser() {
    const status = document.getElementById("status");
    status.textContent = "Adding user...";
  
    try {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
  
      const user = data.results[0];
      const fullName = `${user.name.first} ${user.name.last}`;
      status.textContent = `User added: ${fullName}`;
    } catch (error) {
      status.textContent = "Failed to add user. Try again.";
      console.error("Error fetching user:", error);
    }
  }
  