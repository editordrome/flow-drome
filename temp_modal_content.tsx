        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user-data" className="flex items-center space-x-2">
              <UserCog className="h-4 w-4" />
              <span>Dados do Usuário</span>
              {(errors.name || errors.email || errors.password || errors.confirmPassword) && (
                <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 flex items-center justify-center">
                  !
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <KeyRound className="h-4 w-4" />
              <span>Permissões</span>
              {formData.selectedModules.length > 0 && (
                <Badge variant="default" className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {formData.selectedModules.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Aba de Dados do Usuário */}
          <TabsContent value="user-data" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário de Dados */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCog className="h-5 w-5 text-blue-600" />
                      <span>Informações Pessoais</span>
                    </CardTitle>
                    <CardDescription>
                      Preencha os dados básicos do novo atendente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Digite o nome completo"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Digite o e-mail"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Digite a senha"
                          className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Confirme a senha"
                          className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumo dos Dados */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nome:</span>
                      <Badge variant="outline" className="max-w-[100px] truncate">
                        {formData.name || 'Não preenchido'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">E-mail:</span>
                      <Badge variant="outline" className="text-xs max-w-[100px] truncate">
                        {formData.email || 'Não preenchido'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Senha:</span>
                      <Badge variant={formData.password ? 'default' : 'secondary'}>
                        {formData.password ? 'Definida' : 'Pendente'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Validação:</span>
                      <Badge variant={Object.keys(errors).length === 0 && formData.name && formData.email && formData.password && formData.confirmPassword ? 'default' : 'destructive'}>
                        {Object.keys(errors).length === 0 && formData.name && formData.email && formData.password && formData.confirmPassword ? 'Válido' : 'Incompleto'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Por favor, corrija os erros nos campos destacados.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Aba de Permissões */}
          <TabsContent value="permissions" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[50vh]">
              {/* Seleção de Módulos */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Módulos Disponíveis</span>
                      <Badge variant="outline">
                        {formData.selectedModules.length} de {availableModules.length} selecionados
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Selecione os módulos que o atendente poderá acessar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-4">
                        {Object.keys(modulesByCategory).map(category => (
                          <div key={category} className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-700">
                                {getCategoryLabel(category)}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {modulesByCategory[category].length} módulos
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 pl-4">
                              {modulesByCategory[category].map(module => {
                                const isSelected = formData.selectedModules.includes(module.id);
                                
                                return (
                                  <div 
                                    key={module.id} 
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                      isSelected
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleModuleToggle(module.id)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Switch
                                        checked={isSelected}
                                        onCheckedChange={() => handleModuleToggle(module.id)}
                                      />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {module.display_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {module.name}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {isSelected && (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Resumo das Permissões */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Permissões</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Módulos selecionados:</span>
                      <Badge variant="default">{formData.selectedModules.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total disponível:</span>
                      <Badge variant="outline">{availableModules.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Unidade:</span>
                      <Badge variant="secondary" className="text-xs max-w-[80px] truncate">
                        {unitName}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {formData.selectedModules.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Módulos Selecionados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {formData.selectedModules.map(moduleId => {
                            const module = availableModules.find(m => m.id === moduleId);
                            return module ? (
                              <div key={moduleId} className="flex items-center space-x-2 p-2 rounded bg-blue-50">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {module.display_name}
                                  </p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {formData.selectedModules.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Selecione pelo menos um módulo para o atendente ter acesso ao sistema.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {formData.selectedModules.length > 0 && (
                <span className="text-blue-600">{formData.selectedModules.length} módulos selecionados</span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(errors).length > 0 || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Atendente
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
