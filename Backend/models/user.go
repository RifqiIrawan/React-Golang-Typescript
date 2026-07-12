package models

type User struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Nama   string `json:"nama"`
	Email  string `json:"email" gorm:"unique"`
	Role   string `json:"role"`
	Status string `json:"status"`
}
