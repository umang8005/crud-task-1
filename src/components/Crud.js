import { useEffect, useState } from "react";
import Axios from "axios";
import Container from 'react-bootstrap/Container';
import { Nav, NavDropdown, Pagination, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Crud() {

    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Axios.get("http://localhost:3000/user")
            .then((res) => {
                setData(res.data);
                setFilteredData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getinputvalue = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setUser({ ...user, [name]: value });
        console.log(user);
    };

    const submitdata = (e) => {
        e.preventDefault();
        console.log(user);

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

        if (!user.username) {
            alert("Username Is Required. ");
        } else if (user.username.length < 3) {
            alert('Username Must Be At Least 3 Characters Long');
        } else if (!user.email) {
            alert("Email Is Required. ");
        } else if (!emailPattern.test(user.email)) {
            alert("Enter Valid Email.");
        } else if (!user.phone) {
            alert("Phone No. Is Required.");
        } else if (user.phone.length > 10 || user.phone.length < 10) {
            alert("Phone Number Should Contain 10 Digits");
        } else if (!user.image) {
            alert("Image Is Required.");
        } else if (!urlPattern.test(user.image)) {
            alert("Enter a Valid Image URL.");
        } else {
            if (user.id) {
                Axios.put("http://localhost:3000/user/"+user.id, user)
                    .then(() => {
                        setUser({});
                        getData();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                Axios.post("http://localhost:3000/user", user)
                    .then(() => {
                        setUser({});
                        getData();
                        alert("Data Submit");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };

    const deletedata = (id) => {
        Axios.delete("http://localhost:3000/user/"+id)
            .then(() => {
                getData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updatedata = (id) => {
        const updateuser = filteredData.find((u) => u.id === id);
        setUser(updateuser);
    };

    const Search = (e) => {
        setSearchQuery(e.target.value);
        const filtered = data.filter((u) =>
            u.username.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleSort = (sortBy) => {
        setSortBy(sortBy);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        const sortedData = [...filteredData];
        sortedData.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });
        setFilteredData(sortedData);
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePostsPerPageChange = (value) => {
        setPostsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div>
                <form method="post" onSubmit={(e) => submitdata(e)}>
                    <Table border={1}>
                        <tbody>
                            <tr>
                                <td className="text-end">Enter User Name :</td>
                                <td className="text-start"><input type="text" name="username" id="username" value={user.username ? user.username : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Enter User Email :</td>
                                <td className="text-start"><input type="text" name="email" id="email" value={user.email ? user.email : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Enter User Phone :</td>
                                <td className="text-start"><input type="text" name="phone" id="phone" value={user.phone ? user.phone : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Image URL :</td>
                                <td className="text-start"><input type="text" name="image" id="image" value={user.image ? user.image : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end"></td>
                                <td className="text-start"><input type="submit" name="submit" className="btn btn-primary" /></td>
                            </tr>
                        </tbody>
                    </Table>
                </form>

                
                <div>
                    <div>
                        <input type="text" placeholder="Search By Name.." name="Search" onChange={Search} />
                    </div>
                </div>
                <div>
                        <select className="form-select" onChange={(e) => handlePostsPerPageChange(parseInt(e.target.value))}>
                            <option value="5">5 Records</option>
                            <option value="10">10 Records</option>
                            <option value="15">15 Records</option>
                        </select>
                </div>
                <br />
                <Table border={1}>
                        <tr>
                            <th>No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                        {currentPosts.map((v, i) => {
                            return (
                                <tr key={v.id}>
                                    <td>{i+1}</td>
                                    <td><img src={v.image} alt="image" width="60px" height="60px" /></td>
                                    <td>{v.username}</td>
                                    <td>{v.email}</td>
                                    <td>{v.phone}</td>
                                    <td>
                                        <button onClick={() => updatedata(v.id)}>update</button>
                                        <button onClick={() => deletedata(v.id)}>delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                </Table>
                <Pagination>
                    {pageNumbers.map(number => (
                        <Pagination.Item key={number} onClick={() => paginate(number)} active={number === currentPage}>
                            {number}
                        </Pagination.Item>
                    ))}
                </Pagination>
                <br />
            </div>
        </Container>
    )
}

export default Crud;
