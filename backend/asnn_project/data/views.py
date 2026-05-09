from django.db.models import Q
from rest_framework import generics, views
from rest_framework.response import Response

from .models import Area, Category, DataEntry, SearchLog
from .serializers import (
    AreaSerializer, AreaListSerializer, CategorySerializer,
    SearchResultSerializer,
)


class AreaListView(generics.ListAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaListSerializer
    pagination_class = None  # always return plain array


class AreaDetailView(generics.RetrieveAPIView):
    queryset = Area.objects.prefetch_related('entries__category')
    serializer_class = AreaSerializer
    lookup_field = 'slug'


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class SearchView(views.APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'results': [], 'query': '', 'count': 0})

        qs = DataEntry.objects.select_related('area', 'category').filter(
            Q(area__name__icontains=query) |
            Q(category__name__icontains=query) |
            Q(description__icontains=query)
        )

        count = qs.count()
        SearchLog.objects.create(query=query, results_count=count)
        serializer = SearchResultSerializer(qs[:50], many=True)
        return Response({'results': serializer.data, 'query': query, 'count': count})


class RecentSearchesView(views.APIView):
    def get(self, request):
        recent = (
            SearchLog.objects
            .values_list('query', flat=True)
            .order_by('-searched_at')[:20]
        )
        unique = list(dict.fromkeys(recent))[:10]
        return Response({'recent': unique})
