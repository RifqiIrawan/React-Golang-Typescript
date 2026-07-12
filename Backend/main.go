package main

import (
	"log"

	"backend/config"
	"backend/models"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file tidak ditemukan")
	}

	config.ConnectDatabase()

	if err := config.DB.AutoMigrate(&models.User{}); err != nil {
		log.Fatal("Gagal migrate: ", err)
	}
	log.Println("Migrasi berhasil, tabel users siap")
}
