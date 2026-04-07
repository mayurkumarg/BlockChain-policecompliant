const axios = require('axios');

const testUpdate = async () => {
    try {
        // 1. Log in to get token
        const loginRes = await axios.post('http://localhost:5005/api/auth/login', {
            email: 'admin@police.gov',
            password: 'adminpassword123'
        });
        const token = loginRes.data.token;
        console.log("LOGGED IN AS ADMIN, ROLE:", loginRes.data.role);

        // 2. Get first complaint
        const complaintsRes = await axios.get('http://localhost:5005/api/complaints', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (complaintsRes.data.length === 0) {
            console.log("NO COMPLAINTS FOUND TO TEST");
            process.exit(0);
        }
        const firstId = complaintsRes.data[0].id;
        console.log("UPDATING COMPLAINT ID:", firstId);

        // 3. Try update
        const updateRes = await axios.put(`http://localhost:5005/api/complaints/${firstId}/status`, {
            status: 'In Progress'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("UPDATE RESULT:", updateRes.data.status);
        process.exit(0);
    } catch (e) {
        console.error("FAIL:", e.response ? e.response.status : e.message);
        if (e.response) console.error("BODY:", JSON.stringify(e.response.data));
        process.exit(1);
    }
};

testUpdate();
