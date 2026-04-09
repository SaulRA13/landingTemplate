'use client';

import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnalysisResult {
  success: boolean;
  predict: string;
  confidence: number;
}

export default function XRayAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleImageChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setError('');
      setResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Por favor selecciona una imagen válida');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageChange(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageChange(files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError('');
    
    try {
      // Convertir imagen a base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]; // Remover el prefijo data:image/...

        try {
          const response = await fetch('http://backtest/api/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Data,
            }),
          });

          if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
          }

          const data: AnalysisResult = await response.json();
          setResult(data);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error al analizar la imagen';
          
          // Detectar si es un error de conexión
          if (errorMessage.includes('Failed to fetch') || errorMessage.includes('fetch')) {
            setError('Aún no hay conexión con el back');
          } else {
            setError(errorMessage);
          }
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la imagen');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview('');
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        {/* Título y descripción */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Análisis de Radiografías
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Carga una radiografía de tórax para detectar posibles signos de neumonía
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!result ? (
          <div className="space-y-4">
            {/* Área de carga */}
            <Card
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer p-0"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <label className="block p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {preview ? (
                    <div className="relative w-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-96 mx-auto rounded-lg object-contain"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReset();
                        }}
                      >
                        Cambiar imagen
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                        <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          Arrastra tu radiografía aquí
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          o haz clic para seleccionar una imagen
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Formatos soportados: JPG, PNG, GIF, WebP
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </label>
            </Card>

            {/* Botón de análisis */}
            <Button
              onClick={analyzeImage}
              disabled={!image || loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analizando radiografía...
                </>
              ) : (
                'Examinar'
              )}
            </Button>
          </div>
        ) : (
          /* Resultados */
          <div className="space-y-4">
            <Card className="p-8">
              <div className="space-y-6">
                {/* Resultado principal */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Diagnóstico
                    </p>
                    <p className="text-3xl font-bold">
                      {result.predict === 'NORMAL' ? 'Normal' : 'Neumonía Detectada'}
                    </p>
                  </div>
                  <div>
                    {result.predict === 'NORMAL' ? (
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    ) : (
                      <AlertCircle className="w-16 h-16 text-orange-500" />
                    )}
                  </div>
                </div>

                {/* Confianza */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confianza del análisis
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {(result.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        result.confidence >= 0.8
                          ? 'bg-green-500'
                          : result.confidence >= 0.6
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Estado */}
                {result.success && (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      Análisis completado exitosamente
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>

            {/* Información de la radiografía */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Radiografía analizada</h3>
              <img
                src={preview}
                alt="Radiografía"
                className="max-h-64 mx-auto rounded-lg object-contain mb-4"
              />
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Analizar otra radiografía
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
