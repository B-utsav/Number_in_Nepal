from rest_framework import serializers
from .models import Area, Category, DataEntry


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description']


class DataEntrySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = DataEntry
        fields = ['id', 'category', 'number', 'description', 'source', 'last_verified']


class AreaSerializer(serializers.ModelSerializer):
    entries = DataEntrySerializer(many=True, read_only=True)

    class Meta:
        model = Area
        fields = ['id', 'name', 'slug', 'description', 'latitude', 'longitude', 'zone', 'entries']


class AreaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name', 'slug', 'latitude', 'longitude', 'zone']


class SearchResultSerializer(serializers.ModelSerializer):
    area_name = serializers.CharField(source='area.name')
    area_slug = serializers.CharField(source='area.slug')
    area_lat  = serializers.FloatField(source='area.latitude')
    area_lng  = serializers.FloatField(source='area.longitude')
    area_zone = serializers.CharField(source='area.zone')
    category_name = serializers.CharField(source='category.name')
    category_icon = serializers.CharField(source='category.icon')

    class Meta:
        model = DataEntry
        fields = [
            'id', 'area_name', 'area_slug', 'area_lat', 'area_lng', 'area_zone',
            'category_name', 'category_icon', 'number', 'description', 'source',
        ]
