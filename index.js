const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("./food.db");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

function image(id) {
    return "https://drive.google.com/thumbnail?id=" + id + "&sz=w1000";
}

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS menu (
            menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            image TEXT,
            category TEXT NOT NULL
        )
    `);

    const menuData = [

        // ซูชิ
        ["ซูชิแซลมอน", 25, "ซูชิ", "1uoSMVkYIATrGGMpDa5tmWKslAPCsViJs"],
        ["ซูชิทูนา", 35, "ซูชิ", "1UyA9_irhnzWWx9B_TR6AZh8kO-9MAps8"],
        ["ซูชิซาบะดอง", 20, "ซูชิ", "13-JVJxpqIhpz3DgIZ0ImYXqmfxQ8lBLN"],
        ["ซูชิกุ้งสด", 20, "ซูชิ", "1MW4Ltmc2aa1Qd_RJ-aAwUxMXiVmW6xL2"],
        ["ซูชิไข่ปลาแซลมอน", 60, "ซูชิ", "1O-6r1lR2OF02ezlM5bdk2jbOF67KlRkQ"],
        ["ซูชิแซลมอนย่าง", 30, "ซูชิ", "1HKWchgPyONRcLiTSLqIJj65Wufg1s6pi"],
        ["ซูชิไข่กุ้ง", 20, "ซูชิ", "1MHaZEgx6yYrcY6q4uXwhQ-XUNPga6usQ"],
        ["ซูชิไข่หวาน", 20, "ซูชิ", "1tq_k2jQOpADvxlVvPrFLa-TiKj8xuChT"],
        ["แซลมอนโรล", 180, "ซูชิ", "1BksE2QZ0ga9ovIfqEHHGrA_mQvDUf1XL"],
        ["ทูน่าโรล", 180, "ซูชิ", "1-61_BeN0UTfanv9mzaLPlJbOtwkI4qVQ"],

        // ของทอด
        ["ปีกไก่ทอดน้ำปลา", 100, "ของทอด", "1_CDf1L7hKUZ0nxo5LrgGRceowKNvMGJi"],
        ["ชีสบอล", 80, "ของทอด", "1_SQz-9jY9DXttLqxKx5osiqydumYYvCU"],
        ["ทอดมันกุ้ง", 120, "ของทอด", "16XmOD5a3Cwgqmqrlq7r1v7cMYENKs6yg"],
        ["ไก่คาราอาเกะ", 80, "ของทอด", "1BeKfz_pGJKsDZS-w6X15kn75fWT85qCq"],
        ["ปลาหมึกชุบแป้งทอด", 100, "ของทอด", "1-2b3aJ9OY_FEjn3PejOFvUcZHNZqH4yC"],
        ["เฟรนช์ฟรายส์", 70, "ของทอด", "1Bqia9XSkoXpy3PnxNd4EA4UBOVbBs8Kr"],
        ["หอมหัวใหญ่ทอด", 70, "ของทอด", "1iWVGvOizu5hKywP-cxz2NFFDIVqA59eR"],
        ["เกี๊ยวซ่าทอด", 80, "ของทอด", "1R855rmTnPr5q6GnFZlChA_cIm5iSq6yJ"],
        ["เต้าหู้ทอด", 60, "ของทอด", "15ZsaIYQhUDIGgJ0hz_xfYXNiiFAz6U6s"],
        ["กุ้งเทมปุระ", 130, "ของทอด", "1invlLBQH4crLLC7BQpma3sALU4GaqgJz"],

        // เส้น/ซุป
        ["ทงคัตสึราเมน", 170, "เส้น/ซุป", "1vwS03MU24-odv2o7tjcAx0qJeZERb9kF"],
        ["โชยุราเมน", 150, "เส้น/ซุป", "1kqGpuUlR0Hgt1Yv91-IgwSvO1Vzt7rGS"],
        ["มิโซะราเมน", 140, "เส้น/ซุป", "19JkNzKBCzY9RW7Ub3vkczTxyJzGZrymN"],
        ["ชาชูเมน", 160, "เส้น/ซุป", "1s0FSN_R8KXBXuDqpTKNkzm9N_Uk-4LQ9"],
        ["โซเมน", 100, "เส้น/ซุป", "1jVkU7S0j1BPuuj3LL5bCiQ71dfE64IwS"],
        ["ยากิโซบะ", 130, "เส้น/ซุป", "10vaszfpzj7_XdJrnc2fJ7_8vFhx3zyhF"],
        ["ซารุโซบะ", 120, "เส้น/ซุป", "1dfOQzjPiuBTSVpafMYuQjoYi8RUlsKM_"],
        ["โอเด้ง", 100, "เส้น/ซุป", "1r_zVPvm067RXN4lNojKFvW3gZL5oj8K2"],
        ["ซุปหัวไชเท้าต้มซีอิ๊ว", 70, "เส้น/ซุป", "1-13q7tZeu9a62fLmm3pgG2LoH_WXN4me"],
        ["ซุปมิโซะ", 30, "เส้น/ซุป", "1eU0BNKbgZcD16s12kXqRhPwCqbjtXcs4"],

        // ของทานเล่น
        ["ทาโกยากิ", 80, "ของทานเล่น", "1zklG2cvNSEwvAPhHbah0tGCDg0dSULaB"],
        ["พิซซ่าญี่ปุ่น", 130, "ของทานเล่น", "1h9SyZSKtNdzBewKcrEMA4LlNHCaYw-Xp"],
        ["ถั่วแระญี่ปุ่น", 40, "ของทานเล่น", "1dOw4-_3qf2bekO7tDWDEH1ecamua3VXD"],
        ["ไข่ตุ๋นญี่ปุ่น", 40, "ของทานเล่น", "1PdrEh_cWowj4QuOycbVv6Nw46_-yuAuG"],
        ["ยำสาหร่าย", 30, "ของทานเล่น", "1_fFUSypRRGBFP62Ch3hOSA7d6FHqnrWz"],
        ["ยากิโทริ", 40, "ของทานเล่น", "1EuVc5eiobeaNq1tfevNvAvuvf1fSTnEp"],
        ["มันหวานญี่ปุ่นเผา", 100, "ของทานเล่น", "1IoRy_-yOwQijyse0OIOe_VEKwyGoK6ut"],
        ["ทูน่าทาทากิ", 170, "ของทานเล่น", "1psRbjUbYbKM5tKRnD2o3FVKDJn7T1Vsp"],
        ["เต้าหู้เย็นญี่ปุ่น", 60, "ของทานเล่น", "1DlUHjWQKCFHLgfGNd8ViKdwYAHnnfSM-"],
        ["ฟักทองญี่ปุ่นต้มซีอิ๊ว", 60, "ของทานเล่น", "1xZTGqRnCYScUkHVj1tr4Uej_hEC9328j"],

        // เครื่องดื่ม
        ["น้ำผึ้งมะนาวโซดา", 50, "เครื่องดื่ม", "1Z07tRqk1kSSL6eVa0f6Z6DgfLuMKi_1u"],
        ["โค้ก", 30, "เครื่องดื่ม", "15N1Jghdt506dqviqEeUIZk43Dz7CsECo"],
        ["สไปรท์", 30, "เครื่องดื่ม", "1ncM-f9gXjOJH3iXKuOhgs162lzDYD6SU"],
        ["ชามะนาวเย็น", 50, "เครื่องดื่ม", "1jRy7ixvsvD8elf7-oq5WU0g6H5DtfuDr"],
        ["ชาดำเย็น", 50, "เครื่องดื่ม", "18meWWSUt66GqEHMFbRfzBMA21Dlq8jHh"],
        ["ชาไทยเย็น", 50, "เครื่องดื่ม", "1ODG9x2pNaU3C2kTr_5jLYRYB4wqDeC9I"],
        ["โกโก้เย็น", 50, "เครื่องดื่ม", "12D_hTiclfAruxjgPNAMbQBJWGvTcCPQ5"],
        ["ชาเขียว", 40, "เครื่องดื่ม", "1BEBFey0rg1fOqzXEzuzc8CgQ3J2NYEii"],
        ["น้ำส้ม", 50, "เครื่องดื่ม", "1iqWi2Drw62Fyz-BBAmVjK2MnANRspP1c"],
        ["น้ำเปล่า", 20, "เครื่องดื่ม", "1g_uQRQTRBRQF2gB4TT5LwhpBn8C8p9Xt"]
    ];

    db.run("DELETE FROM menu", () => {

        const sql = `
            INSERT INTO menu
            (name, price, image, category)
            VALUES (?, ?, ?, ?)
        `;

        const stmt = db.prepare(sql);

        menuData.forEach(menu => {
            stmt.run(
                menu[0],
                menu[1],
                image(menu[3]),
                menu[2]
            );
        });

        stmt.finalize();
    });
});

app.get("/", (req, res) => {

    const table = req.query.table || 1;

    // โค้ดดึงเมนูของคุณเดิม
    db.all("SELECT * FROM menu", [], (err, menus) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database Error");
        }

        res.render("home", {
            menus: menus,
            table: table
        });

    });

});

app.post("/add-to-cart", (req, res) => {

    const menu_id = req.body.menu_id;
    const quantity = Number(req.body.quantity);

    const spicy = req.body.spicy || "";

    let topping = req.body.topping || [];

    // ถ้าเลือก topping แค่อันเดียว
    if (!Array.isArray(topping)) {
        topping = [topping];
    }

    console.log("menu_id:", menu_id);
    console.log("quantity:", quantity);
    console.log("spicy:", spicy);
    console.log("topping:", topping);


    // เอาข้อมูลตรงนี้ไปเพิ่มใน cart ของคุณ

    res.redirect("/cart");
});

app.get("/addon", (req, res) => {

    const menu_id = req.query.menu_id;
    const table = req.query.table || 1;

    db.get(
        "SELECT * FROM menu WHERE menu_id = ?",
        [menu_id],
        (err, menu) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Database Error");
            }

            if (!menu) {
                return res.status(404).send("ไม่พบเมนู");
            }

            res.render("addon", {
                menu: menu,
                table: table
            });

        }
    );

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});