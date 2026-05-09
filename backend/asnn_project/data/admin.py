from django.contrib import admin
from .models import Area, Category, DataEntry, SearchLog


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ['name', 'zone', 'latitude', 'longitude']
    list_filter = ['zone']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(DataEntry)
class DataEntryAdmin(admin.ModelAdmin):
    list_display = ['area', 'category', 'number', 'last_verified']
    list_filter = ['area', 'category']
    search_fields = ['area__name', 'category__name', 'description']


@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = ['query', 'results_count', 'searched_at']
    readonly_fields = ['query', 'results_count', 'searched_at']
