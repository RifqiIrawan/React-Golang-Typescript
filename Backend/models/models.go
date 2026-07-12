package models

// untuk migration table, kita bisa menambahkan semua model yang ingin dimigrasikan ke dalam slice AllModels. Ini akan memudahkan kita untuk melakukan migrasi semua model sekaligus.
var AllModels = []interface{}{
	&User{},
	&Produk{},
	&Karyawan{},
}
