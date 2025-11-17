import mongoose from 'mongoose'

export async function connect() {
    try {
        const mongo = await mongoose.connect(process.env.MONGODB_URI);
        const connection = mongo.connection;
        connection.on('connected', () => {
            console.log("データベース接続成功しました")
        })

        connection.on('error', (err) => {
            console.log("データベース接続失敗しました：" + err);
            process.exit();
        })
    }catch (error) {
        console.log("データベース接続失敗しました：" + error);
    }
}