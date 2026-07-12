package models

type Produk struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	Nama      string  `json:"nama"`
	Deskripsi string  `json:"deskripsi"`
	Harga     float64 `json:"harga"`
	Stock     int     `json:"stock"`
}

func (Produk) TableName() string {
	return "produk"
}
