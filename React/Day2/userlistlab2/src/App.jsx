import { useState } from "react";

const Users = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", phone: "123-456-7890", dob: "1990-05-14", role: "admin", image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", phone: "234-567-8901", dob: "1985-11-22", role: "user", image: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "345-678-9012", dob: "1992-02-10", role: "moderator", image: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Mohamed Abdelhaq", email: "momo@gmail.com", phone: "01000539560", dob: "2002-09-11", role: "user", image: "https://i.pravatar.cc/150?u=2" }
];

function getRoleStyling(role) {
  const lowRole = role.toLowerCase();

  if (lowRole === "admin") {
    return "bg-red-100 text-red-700 border-red-200";
  } else if (lowRole === "user") {
    return "bg-green-100 text-green-700 border-green-200";
  } else if (lowRole === "moderator") {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  } else {
    return "bg-gray-100 text-gray-700";
  }
}

function App() {
  const [users, setUsers] = useState(Users);

  const [search, setSearch] = useState("");

  function searchHandler(event){
    setSearch(event.target.value.toLowerCase()); // update searchbar
    setUsers(Users.filter((user)=> user.email.toLowerCase().includes(event.target.value.toLowerCase()))); //update users screen
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={searchHandler}
          className="p-2 border border-gray-300 rounded-lg w-full max-w-md shadow-sm outline-none focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-sm"
            />

            <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>

            <p className="text-sm text-blue-600 mb-2">{user.email}</p>

            <div className="text-sm text-gray-500 mb-4">
              <p>{user.phone}</p>

              <p>{user.dob}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getRoleStyling(user.role)}`}
            >
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
