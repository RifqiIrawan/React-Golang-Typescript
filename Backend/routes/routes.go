package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// User routes
		api.GET("/users", handlers.GetUsers)
		api.POST("/users", handlers.CreateUser)
		api.PUT("/users/:id", handlers.UpdateUser)
		api.DELETE("/users/:id", handlers.DeleteUser)

		// Produk routes
		api.GET("/produk", handlers.GetProduk)
		api.POST("/produk", handlers.CreateProduk)
		api.PUT("/produk/:id", handlers.UpdateProduk)
		api.DELETE("/produk/:id", handlers.DeleteProduk)

		// Karyawan routes
		api.GET("/karyawan", handlers.GetKaryawan)
		api.POST("/karyawan", handlers.CreateKaryawan)
		api.PUT("/karyawan/:id", handlers.UpdateKaryawan)
		api.DELETE("/karyawan/:id", handlers.DeleteKaryawan)
	}
}
