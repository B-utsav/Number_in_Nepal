from django.db import models


class Area(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    zone = models.CharField(max_length=50, default='central')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=10, default='📍')
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class DataEntry(models.Model):
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='entries')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='entries')
    number = models.IntegerField()
    description = models.TextField()
    source = models.CharField(max_length=300, blank=True)
    last_verified = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['area', 'category']

    def __str__(self):
        return f"{self.area.name} – {self.category.name}: {self.number}"


class SearchLog(models.Model):
    query = models.CharField(max_length=500)
    results_count = models.IntegerField(default=0)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']

    def __str__(self):
        return f'"{self.query}" at {self.searched_at}'
