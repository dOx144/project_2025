const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const pool = require('./db'); 
const { AsyncLocalStorage } = require('async_hooks');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/uploads', express.static('uploads'));

const port = 3000;

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


app.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM USERS");
        res.status(200).send({
            message: "Hello, server is running",
            result: result.rows[0]
        });
    } catch (error) {
        console.error("Error querying the database:", error);
        res.status(500).send({
            message: "Server error",
            error: error.message
        });
    }
});

//insert users in the user database
app.post("/api/users", async(req, res)=>{
    const {username, email, password } = req.body
    
    
    try{
        const check = await pool.query("SELECT * FROM USERS WHERE email = $1",[email]);

        if(check.rows.length > 0){
             return res.status(400).send({
                message:"User Email already exists! Please use a new email."
             })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query("INSERT INTO USERS(username, email, password) VALUES($1,$2,$3) RETURNING *",[username, email, hashedPassword]);

        res.status(200).send({
            message:"Successfully created the user!",
            added:result.rows[0],
        })
    }catch(err){
        console.error("Error inserting user: " , err)
        res.status(500).send({
            message:"Failed to create user",
            error: err.message
        })
    }
})

//get all users names
app.get('/api/usernames', async (req, res) => {
  try {
    const result = await pool.query('SELECT username FROM users');
    res.json(result.rows); // returns [{ username: 'user1' }, { username: 'user2' }, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//get user detail
app.get("/api/userdetails/:id", async (req, res) => {
  const { id } = req.params; // get id from route params, not body

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]); // return single user object
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Update user interests
app.post("/api/users/updateInterest", async (req, res) => {
  const { userId, interests } = req.body;

  // Validate input
  if (!userId || !Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({ message: "Invalid request: userId and non-empty interests array are required" });
  }

  try {
    // Update user_interest as a proper array
    const result = await pool.query(
      "UPDATE users SET user_interest = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [interests, userId] // Pass actual array
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User interests updated", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating interests:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// checks if the user exists or not then sends some data
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const result = await pool.query("SELECT * FROM USERS WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        // Success
        res.status(200).send({
            message: "Login successful",
            user
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send({ message: "Server error", error: err.message });
    }
});

// put profile picture
app.post('/api/upload_profile', upload.single('file'), async (req, res)=>{
   try{
    const name = req.file.filename
    const filename = req.file.originalname
    const {title, description} = req.body

    const myQuery = await pool.query("INSERT INTO items(name, description, title) VALUES ($1, $2, $3) RETURNING *",[filename, description, title])

    res.send({message:"Success",file:req.file, item:myQuery.rows[0]})
   }catch(err){
    console.error(err)
    res.status(500).send({error:"Something Went wrong"})
   }
})

// get all items
app.get('/api/auctionItems', async(req,res)=>{
const items = await pool.query(`
  SELECT 
    items.*,
    users.username AS seller_name,
    users.profile_pic AS seller_pic,
    users.is_verified AS seller_verified
  FROM items
  JOIN users ON items.owner_id = users.id;
`);


    res.status(200).send({message:"Success!", result : items.rows})
})

// get specific item
app.get('/api/item/:id', async(req,res)=>{
    const { id } = req.params

    try {
         const item = await pool.query(`
            SELECT 
                items.*,
                users.username AS seller_name,
                users.profile_pic AS seller_pic
            FROM items
            JOIN users ON items.owner_id = users.id
            WHERE items.id = $1
            `, [id]);

        if (item.rows.length === 0) {
        return res.status(404).send({ message: 'Item not found' });
        }

        res.status(200).send({
        message: 'Item successfully retrieved',
        item: item.rows[0],
        });
     } catch (err) {
        console.error('Error retrieving item:', err);
        res.status(500).send({ message: 'Server error' });
    }

})

// get specific tagged items
// app.get('/api/suggested-items/:id', async (req, res) => {
//   const tag = req.params.id; // Extract tag value from URL param

//   try {
//     const result = await pool.query(
//       "SELECT * FROM items WHERE tags @> ARRAY[$1]",
//       [tag]
//     );

//     res.status(200).send({
//       message: "Successfully!",
//       result: result.rows
//     });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });

// multiple tagged
app.get('/api/suggested-items/:tags', async (req, res) => {
  const tagsParam = req.params.tags; // e.g., "electronics,vintage,classic"
  const tagsArray = tagsParam.split(','); // → ['electronics', 'vintage', 'classic']

  try {
    const result = await pool.query(
    `SELECT 
        items.*, 
        users.username AS seller_name, 
        users.profile_pic AS seller_pic
        FROM items
        JOIN users ON items.owner_id = users.id
        WHERE items.tags && $1::text[]`,
    [tagsArray]
    );

    res.status(200).send({
      message: "Successfully fetched items!",
      result: result.rows
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});



// admin
//get users
app.post('/api/admin/users', async (req, res) => {
    const { id, username, email, role } = req.body;

    if (!id || !username || !email || !role) {
        return res.status(400).json({ error: 'Missing required user information' });
    }

    if (role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM users');
        const otherUsers = rows.filter(user => user.id !== id);

        setTimeout(() => {
            res.status(200).json({
            message: 'Successfully retrieved remaining users',
            result: otherUsers
        });
        }, 1000);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching data', details: err.message });
    }
});

// update verification
app.patch('/api/admin/user_verification', async(req, res) => {
    const {id, is_verified} = req.body

    try{
        const result = await pool.query(
            "UPDATE users SET is_verified = $1 WHERE id = $2",
            [!is_verified, id]
         )
         res.status(200).send({ message: "Success!", result });
    }catch(err){
        console.error("ERROR UDATING STATUS:", err)
        res.status(500).send({message:"Failed Verification"})
    }
})

// delete user
app.delete('/api/admin/delete_user/:id', async (req, res) => {
  const { id } = req.params;  // get id from URL parameter

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "Successfully Deleted!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//gets items
app.post('/api/admin/items', async (req, res) => {
    const { id, username, email, role } = req.body;

    if (!id || !username || !email || !role) {
        return res.status(400).json({ error: 'Missing required user information' });
    }

    if (role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    try {
           const query = `
                        SELECT 
                            items.*, 
                            users.username AS seller
                        FROM 
                            items
                        JOIN 
                            users ON items.owner_id = users.id
                        `;

        const { rows } = await pool.query(query);

        setTimeout(() => {
            res.status(200).json({ result: rows });
        }, 1000);

    } catch (err) {
        res.status(500).json({ error: 'Error fetching items', details: err.message });
    }
});

//verify items
app.patch('/api/admin/item_verification', async (req, res) => {
     const {id, is_verified} = req.body

    try{
        const result = await pool.query(
            "UPDATE items SET is_verified = $1 WHERE id = $2",
            [!is_verified, id]
         )
         res.status(200).send({ message: "Success!" });
    }catch(err){
        console.error("ERROR UDATING STATUS:", err)
        res.status(500).send({message:"Failed Verification"})
    }
})

//delete items 
app.delete('/api/admin/delete_item/:id', async(req, res) => {
    const {id} = req.params

     if (!id || isNaN(parseInt(id))) {
        return res.status(400).send({ message: "Invalid or missing 'id'" });
    }

    try{
        const result = await pool.query(
            "DELETE FROM items WHERE id = $1",[id]
        )

        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Item not found" });
        }

        res.status(200).send({message:"Success"})
    }catch(err){
        res.status(500).send({message:err.message})
    }
})


// user 
// item bid

app.put('/api/user/item/bid', async (req, res) => {
  const { owner_id, item_id, bidder_id, recent_bidder, new_bid } = req.body;

  if (!owner_id || !item_id || !bidder_id || !recent_bidder || new_bid == null) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Get current price
    const currentData = await pool.query(
      `SELECT current_price FROM items WHERE id = $1`,
      [item_id]
    );

    if (currentData.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    const currentBid = currentData.rows[0].current_price;

    if (new_bid <= currentBid) {
      return res.status(400).json({
        error: `Your bid must be higher than the current bid (${currentBid}).`
      });
    }

    // Append new bid record to bidder_history
    const bidRecord = {
      bidder_id,
      bidder_name: recent_bidder,
      bid_amount: new_bid,
      bid_time: new Date().toISOString()
    };

    const result = await pool.query(
      `UPDATE items
       SET 
         recent_bidder = $1,
         bidder_id = $2,
         current_price = $3,
         bidder_history = COALESCE(bidder_history, '[]'::jsonb) || $5::jsonb
       WHERE id = $4
       RETURNING *`,
      [recent_bidder, bidder_id, new_bid, item_id, JSON.stringify([bidRecord])]
    );

    res.status(200).json({
      message: "Bid placed successfully.",
      item: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while placing the bid." });
  }
});



// GET user items based on username or user ID
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Step 2: Get items by user ID from items table
    const itemsResult = await pool.query(
      'SELECT * FROM items WHERE owner_id = $1',
      [userId]
    );

    res.json(itemsResult.rows);
  } catch (err) {
    console.error('Error fetching user items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// create item / add item
app.post('/api/items/add', upload.single('item_image'), async (req, res) => {
    try {
        const file = req.file;
        const {
            title,
            description,
            category,
            condition,
            starting_price,
            seller_id,
            seller_name,
            auction_time
        } = req.body;

        const image_url = file
            ? `http://localhost:${port}/api/uploads/${file.filename}`
            : 'http://localhost:3000/api/uploads/default_item_placeholder.png';

        const tags = [category, condition];
        const created_at = new Date();
        const ends_at = auction_time ? new Date(auction_time) : null;
        const current_price = starting_price;

        const result = await pool.query(
            `INSERT INTO items (
                title, description, image_url, tags,
                starting_price, current_price, owner_id,
                created_at, ends_at, recent_bidder, bidder_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, '', NULL)
            RETURNING *`,
            [
                title,
                description,
                image_url,
                tags,
                starting_price,
                current_price,
                seller_id,
                created_at,
                ends_at
            ]
        );

        res.status(201).json({
            message: "Item successfully added",
            item: result.rows[0]
        });

    } catch (err) {
        console.error("Error adding item:", err.message);
        res.status(500).json({ error: "Failed to add item" });
    }
});

// delete user item
app.delete('/api/user/item_delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ error: "Item not found or already deleted." });
    }

    res.send({
      message: "Delete Successful",
      response: `Item deleted with ID ${id}`
    });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
});

// update username and email
app.post('/api/userdata/update', async (req, res) => {
  try {
    const { id, username, email } = req.body;

    if (!id || !username || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found or not updated' });
    }

    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get user betted item
app.get('/api/user/item_bet/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Valid user ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT 
         items.*, 
         users.username AS seller_name 
       FROM items 
       JOIN users ON items.owner_id = users.id 
       WHERE items.bidder_id = $1`,
      [id]
    );

    res.status(200).json({ result: result.rows });
  } catch (err) {
    console.error("Error fetching user's bet items:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
