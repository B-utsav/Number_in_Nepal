from django.urls import path
from . import views

urlpatterns = [
    path('areas/',            views.AreaListView.as_view()),
    path('areas/<slug:slug>/', views.AreaDetailView.as_view()),
    path('categories/',       views.CategoryListView.as_view()),
    path('search/',           views.SearchView.as_view()),
    path('recent-searches/',  views.RecentSearchesView.as_view()),
]
