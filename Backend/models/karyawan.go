package models

import "time"

type Karyawan struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Nik          string    `json:"nik"`
	Nama         string    `json:"nama"`
	Alamat       string    `json:"alamat"`
	TanggalLahir time.Time `json:"tanggalLahir" gorm:"type:date"`
}

func (Karyawan) TableName() string {
	return "karyawan"
}
