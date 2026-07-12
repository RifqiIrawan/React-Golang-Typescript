package models

type Produk struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	Nama      string  `json:"nama"`
	Deskripsi string  `json:"deskripsi"`
	Harga     float64 `json:"harga"`
	Stok      int     `json:"stok"`
}
