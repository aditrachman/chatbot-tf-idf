// TF-IDF Implementation for Chatbot
class TFIDFChatbot {
    constructor() {
        this.documents = [];
        this.vocabulary = new Set();
        this.idfCache = new Map();
        this.initializeKnowledgeBase();
    }

    // Initialize knowledge base with common questions and answers
    initializeKnowledgeBase() {
        this.knowledgeBase = [
            {
                question: "apa itu artificial intelligence ai kecerdasan buatan",
                answer: "Artificial Intelligence (AI) atau Kecerdasan Buatan adalah teknologi yang memungkinkan mesin untuk meniru kecerdasan manusia, seperti belajar, bernalar, dan memecahkan masalah. AI digunakan dalam berbagai aplikasi seperti chatbot, pengenalan suara, dan mobil otonom."
            },
            {
                question: "bagaimana cara kerja machine learning pembelajaran mesin",
                answer: "Machine Learning adalah cabang AI yang memungkinkan komputer belajar dari data tanpa diprogram secara eksplisit. Prosesnya melibatkan pelatihan model dengan data, identifikasi pola, dan membuat prediksi pada data baru."
            },
            {
                question: "apa itu programming pemrograman coding koding",
                answer: "Programming atau pemrograman adalah proses menulis instruksi untuk komputer menggunakan bahasa pemrograman seperti Python, JavaScript, Java, atau C++. Ini melibatkan pemecahan masalah, logika, dan kreativitas."
            },
            {
                question: "bagaimana belajar programming pemrograman coding",
                answer: "Untuk belajar programming: 1) Pilih bahasa pemrograman (Python bagus untuk pemula), 2) Pelajari konsep dasar seperti variabel dan loop, 3) Praktik dengan proyek kecil, 4) Gunakan platform seperti Codecademy atau freeCodeCamp, 5) Bergabung dengan komunitas programmer."
            },
            {
                question: "apa itu web development pengembangan website",
                answer: "Web development adalah proses membuat dan memelihara website. Terdiri dari frontend (tampilan yang dilihat user) menggunakan HTML, CSS, JavaScript, dan backend (server, database) menggunakan teknologi seperti Node.js, Python, atau PHP."
            },
            {
                question: "apa itu database basis data",
                answer: "Database adalah sistem penyimpanan data terstruktur yang memungkinkan penyimpanan, pengambilan, dan pengelolaan informasi secara efisien. Contoh: MySQL, PostgreSQL, MongoDB. Database penting untuk aplikasi web dan mobile."
            },
            {
                question: "bagaimana cara membuat website",
                answer: "Untuk membuat website: 1) Pelajari HTML untuk struktur, 2) CSS untuk styling, 3) JavaScript untuk interaktivitas, 4) Pilih framework seperti React atau Vue, 5) Gunakan hosting seperti Netlify atau Vercel, 6) Daftarkan domain jika diperlukan."
            },
            {
                question: "apa itu python bahasa pemrograman",
                answer: "Python adalah bahasa pemrograman yang mudah dipelajari, serbaguna, dan populer. Digunakan untuk web development, data science, AI, automation, dan banyak lagi. Sintaksnya sederhana dan mudah dibaca, cocok untuk pemula."
            },
            {
                question: "apa itu javascript js",
                answer: "JavaScript adalah bahasa pemrograman yang digunakan untuk membuat website interaktif. Berjalan di browser dan server (Node.js). Digunakan untuk animasi, validasi form, manipulasi DOM, dan pengembangan aplikasi web modern."
            },
            {
                question: "bagaimana cara belajar data science",
                answer: "Untuk belajar data science: 1) Pelajari statistik dan matematika dasar, 2) Kuasai Python atau R, 3) Pelajari library seperti pandas, numpy, matplotlib, 4) Praktik dengan dataset real, 5) Pelajari machine learning, 6) Buat portfolio proyek."
            },
            {
                question: "apa itu cloud computing komputasi awan",
                answer: "Cloud computing adalah penyediaan layanan komputasi (server, storage, database, software) melalui internet. Keuntungan: skalabilitas, efisiensi biaya, aksesibilitas global. Contoh provider: AWS, Google Cloud, Microsoft Azure."
            },
            {
                question: "bagaimana cara keamanan cybersecurity",
                answer: "Tips cybersecurity: 1) Gunakan password yang kuat dan unik, 2) Aktifkan two-factor authentication, 3) Update software secara rutin, 4) Hati-hati dengan email phishing, 5) Gunakan VPN di WiFi publik, 6) Backup data secara rutin."
            },
            {
                question: "apa itu blockchain cryptocurrency",
                answer: "Blockchain adalah teknologi distributed ledger yang mencatat transaksi secara aman dan transparan. Cryptocurrency seperti Bitcoin menggunakan blockchain. Aplikasi lain: smart contracts, supply chain, voting systems."
            },
            {
                question: "bagaimana cara membuat aplikasi mobile",
                answer: "Untuk membuat aplikasi mobile: 1) Native (Swift untuk iOS, Kotlin untuk Android), 2) Cross-platform (React Native, Flutter), 3) Hybrid (Ionic, Cordova). Pilih berdasarkan kebutuhan, budget, dan target platform."
            },
            {
                question: "apa itu ui ux design desain",
                answer: "UI (User Interface) fokus pada tampilan visual aplikasi, sedangkan UX (User Experience) fokus pada pengalaman pengguna secara keseluruhan. Keduanya penting untuk menciptakan produk digital yang menarik dan mudah digunakan."
            },
            {
                question: "halo hai hello selamat",
                answer: "Halo! Selamat datang di AI Chatbot. Saya di sini untuk membantu menjawab pertanyaan Anda tentang teknologi, programming, dan topik lainnya. Silakan tanya apa saja!"
            },
            {
                question: "terima kasih thanks thank you",
                answer: "Sama-sama! Senang bisa membantu Anda. Jika ada pertanyaan lain, jangan ragu untuk bertanya. Saya siap membantu kapan saja!"
            },
            {
                question: "siapa kamu who are you",
                answer: "Saya adalah AI Chatbot yang menggunakan algoritma TF-IDF untuk memahami dan menjawab pertanyaan Anda. Saya dirancang untuk membantu dengan berbagai topik, terutama teknologi dan programming."
            }
        ];

        // Preprocess and add documents to corpus
        this.knowledgeBase.forEach(item => {
            this.addDocument(item.question);
        });
        
        this.buildVocabulary();
        this.calculateIDF();
    }

    // Text preprocessing
    preprocessText(text) {
        return text.toLowerCase()
                  .replace(/[^\w\s]/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()
                  .split(' ')
                  .filter(word => word.length > 1);
    }

    // Add document to corpus
    addDocument(text) {
        const tokens = this.preprocessText(text);
        this.documents.push(tokens);
        tokens.forEach(token => this.vocabulary.add(token));
    }

    // Build vocabulary from all documents
    buildVocabulary() {
        this.vocabularyArray = Array.from(this.vocabulary);
    }

    // Calculate Term Frequency
    calculateTF(tokens) {
        const tf = new Map();
        const totalTokens = tokens.length;
        
        tokens.forEach(token => {
            tf.set(token, (tf.get(token) || 0) + 1);
        });
        
        // Normalize by total tokens
        tf.forEach((count, token) => {
            tf.set(token, count / totalTokens);
        });
        
        return tf;
    }

    // Calculate Inverse Document Frequency
    calculateIDF() {
        const totalDocs = this.documents.length;
        
        this.vocabularyArray.forEach(term => {
            let docsWithTerm = 0;
            this.documents.forEach(doc => {
                if (doc.includes(term)) {
                    docsWithTerm++;
                }
            });
            
            const idf = Math.log(totalDocs / (docsWithTerm + 1));
            this.idfCache.set(term, idf);
        });
    }

    // Calculate TF-IDF vector for a document
    calculateTFIDF(tokens) {
        const tf = this.calculateTF(tokens);
        const tfidf = new Map();
        
        this.vocabularyArray.forEach(term => {
            const tfValue = tf.get(term) || 0;
            const idfValue = this.idfCache.get(term) || 0;
            tfidf.set(term, tfValue * idfValue);
        });
        
        return tfidf;
    }

    // Calculate cosine similarity between two TF-IDF vectors
    cosineSimilarity(vector1, vector2) {
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
        
        this.vocabularyArray.forEach(term => {
            const v1 = vector1.get(term) || 0;
            const v2 = vector2.get(term) || 0;
            
            dotProduct += v1 * v2;
            magnitude1 += v1 * v1;
            magnitude2 += v2 * v2;
        });
        
        if (magnitude1 === 0 || magnitude2 === 0) {
            return 0;
        }
        
        return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    }

    // Find best matching answer for a query
    findBestAnswer(query) {
        const queryTokens = this.preprocessText(query);
        const queryTFIDF = this.calculateTFIDF(queryTokens);
        
        let bestMatch = null;
        let bestSimilarity = 0;
        
        this.knowledgeBase.forEach((item, index) => {
            const docTFIDF = this.calculateTFIDF(this.documents[index]);
            const similarity = this.cosineSimilarity(queryTFIDF, docTFIDF);
            
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = item;
            }
        });
        
        // If similarity is too low, return default response
        if (bestSimilarity < 0.1) {
            return {
                answer: "Maaf, saya belum memahami pertanyaan Anda. Bisa Anda coba dengan kata-kata yang berbeda? Saya dapat membantu dengan topik teknologi, programming, AI, web development, dan banyak lagi.",
                confidence: bestSimilarity
            };
        }
        
        return {
            answer: bestMatch.answer,
            confidence: bestSimilarity
        };
    }

    // Add new knowledge to the chatbot
    addKnowledge(question, answer) {
        this.knowledgeBase.push({ question, answer });
        this.addDocument(question);
        this.buildVocabulary();
        this.calculateIDF();
    }
}

// Initialize global chatbot instance
window.chatbot = new TFIDFChatbot();

