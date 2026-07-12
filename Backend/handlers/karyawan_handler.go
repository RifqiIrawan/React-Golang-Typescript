package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"backend/config"
	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetKaryawan(c *gin.Context) {
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil || limit < 1 {
		limit = 10
	}

	search := c.Query("search")

	buildQuery := func() *gorm.DB {
		q := config.DB.Model(&models.Karyawan{})
		if search != "" {
			like := "%" + search + "%"
			q = q.Where("nama ILIKE ? OR alamat ILIKE ?", like, like)
		}
		return q
	}

	var total int64
	if err := buildQuery().Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var karyawan []models.Karyawan
	offset := (page - 1) * limit
	if err := buildQuery().Order("id asc").Offset(offset).Limit(limit).Find(&karyawan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	if totalPages < 1 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"data": karyawan,
		"meta": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}

func CreateKaryawan(c *gin.Context) {
	var input models.Karyawan
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Nik sudah digunakan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, input)
}

func UpdateKaryawan(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id tidak valid"})
		return
	}

	var karyawan models.Karyawan
	if err := config.DB.First(&karyawan, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "karyawan tidak ditemukan"})
		return
	}

	var input models.Karyawan
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	karyawan.Nik = input.Nik
	karyawan.Nama = input.Nama
	karyawan.Alamat = input.Alamat
	karyawan.TanggalLahir = input.TanggalLahir

	if err := config.DB.Save(&karyawan).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Karyawan sudah digunakan"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, karyawan)
}

func DeleteKaryawan(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id tidak valid"})
		return
	}

	if err := config.DB.Delete(&models.Karyawan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "karyawan berhasil dihapus"})
}
